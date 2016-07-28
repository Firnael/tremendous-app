var express = require('express');
var request = require('request');
var async = require('async');
var bnet = require('battlenet-api')('tpkmytrfpdp2casqurxt24z8ub5u4khn');
var characterApiRouter = express.Router();
// Models
var Character = require('../models/character');
var Guild = require('../models/guild');
// Data
var guildName = 'Tremendous';


/**
 * Get all
 */
characterApiRouter.route('/').get(function(req, res) {
    Character.find(function(err, characters) {
        if (err) { res.send(err); }
        res.json(characters);
    });
});

/**
 * Get one
 */
characterApiRouter.route('/info/:characterName').get(function(req, res) {
    Character.findOne({ 'name': req.params.characterName }, function(err, character) {
        if (err) { return res.send(err); }
        if (character == null ) {
          return res.send({ message: 'Cannot find character ' + req.params.characterName });
        }
        res.json(character);
    });
});

/**
 * Update collection, create or remove guild characters based on BNET guild data
 */
characterApiRouter.route('/update-collection').post(function(req, res) {
  console.log('Updating character collection...');

  var addedCharacters = [];
  var removedCharacters = [];
  function overrideCallback(added, characterName, asyncCallback) {
      if(characterName) {
          added ? addedCharacters.push(characterName) : removedCharacters.push(characterName);
      }
      asyncCallback();
  }

  Guild.findOne({ 'name': guildName }, function(errFindGuild, guild) {
      if (errFindGuild) { res.send(errFindGuild); }

      // Iterate over guild members and add / remove them
      async.each(guild.members, function (member, asyncAddCallback) {

          Character.findOne({ 'name': member.name }).exec(function (errFindChar, character) {
            if (errFindChar) { res.send(errFindChar); }

              // If character doesn't exist, create
              if(character == null) {
                  var newCharacter = new Character();
                  newCharacter.lastModified = 0;
                  newCharacter.name = member.name;
                  newCharacter.guildRank = member.rank;
                  var accountId = member.rank in [0, 1, 2, 3, 4, 6] ? Math.floor(Math.random() * 10000000000) : 0;
                  newCharacter.role = 0;
                  newCharacter.accountIdentifier = accountId;
                  newCharacter.save(function(errcreate) {
                      if (errcreate) { res.send(errcreate); }
                      overrideCallback(true, member.name, asyncAddCallback);
                  });
              } else { // else, update rank
                character.guildRank = member.rank;
                character.save(function(errcreate) {
                    if (errcreate) { res.send(errcreate); }
                    overrideCallback(null, null, asyncAddCallback);
                });
              }
          });
      },
      function (errAddAsync) {
          if(errAddAsync) { res.send(errAddAsync); }
          console.log('Characters added.');
          removeKickedCharacters();
      });

      function removeKickedCharacters() {
        // If exists in database but not in guild, remove
        var memberNames = [];
        for(var i=0; i<guild.members.length; i++) {
            memberNames.push(guild.members[i].name);
        }

        Character.find({ name: { $nin: memberNames } }).exec(function (err, characters) {
            if (err) { res.send(err); }

            async.each(characters, function (characterToRemove, asyncRemoveCallback) {
                characterToRemove.remove();
                overrideCallback(false, characterToRemove.name, asyncRemoveCallback);
            },
            function(errRemoveAsync) {
                if(errRemoveAsync) { res.send(errRemoveAsync); }
                console.log('Characters removed.');
                jobDone();
            });
        });
      }

      // End of job callback, sending response
      function jobDone() {
        console.log('Results: ' + addedCharacters.length + ' added, ' + removedCharacters.length + ' removed.');
        return res.send({
          message: 'Character collection updated',
          addedCharacters: addedCharacters,
          removedCharacters: removedCharacters
        });
      }
  });
});

/**
 * Get mains
 */
characterApiRouter.route('/mains').get(function(req, res) {
  Character.where('guildRank').in([0, 1, 2, 3, 4, 6])
            .exec(function (err, characters) {
              if (err) { res.send(err); return; }
              res.send(characters);
  });
});

/**
 * Get roster
 */
characterApiRouter.route('/roster').get(function (req, res) {
  Character.where('guildRank').in([0, 1, 2, 3])
            .exec(function (err, characters) {
              if (err) { res.send(err); return; }
              res.send(characters);
  });
});

/**
 * Get rerolls with no mains
 */
characterApiRouter.route('/rerolls').get(function(req, res) {
  Character.where('guildRank', 5)
            .where('accountIdentifier', 0)
            .exec(function (err, characters) {
              if (err) { res.send(err); return; }
              res.send(characters);
  });
});

/**
 * Get character collection by account identifier
 */
characterApiRouter.route('/account-id/:accountId').get(function(req, res) {
  var accountId = req.params.accountId;
  Character.where('accountIdentifier', accountId)
            .exec(function (err, characters) {
              if (err) { res.send(err); return; }
              res.send(characters);
  });
});

/**
 * Link reroll to main
 */
characterApiRouter.route('/link').post(function (req, res) {
  var reroll = req.body.reroll;
  var main = req.body.main;

  Character.findOne({ 'name': reroll.name }, function(err, character) {
    if (err) { res.send(err); return; }

    character.accountIdentifier = main.accountIdentifier;
    character.save(function(errsave) {
        if (errsave) { return res.send(errsave); }
        var result = 'Reroll: ' + reroll.name + ' linked to Main: ' + main.name;
        console.log(result);
        return res.send({ message: result });
    });
  });
});

/**
 * Set role
 */
characterApiRouter.route('/role').post(function (req, res) {
  Character.findOne({ 'name': req.body.characterName }, function (err, character) {
    if (err) { res.send(err); return; }

    character.role = req.body.role;
    character.save(function(errsave) {
        if (errsave) { return res.send(errsave); }
        console.log('Role: ' + character.role + ' set to character: ' + character.name);
        return res.send(character);
    });
  });
});

/**
 * Update a specific character based on BNET character data
 */
characterApiRouter.route('/update/:characterName').post(function(req, res) {
    Character.findOne({ 'name': req.params.characterName }, function(errlocal, character) {
        if (errlocal) { res.send(errlocal); return; }
        if (character == null ) {
          res.send({ message: 'Cannot find character ' + req.params.characterName });
          return;
        }
        console.log('Updating character ' + character.name + '...');

        /*
        bnet.wow.character.aggregate({
          origin: 'eu', realm: 'ysondre', name: req.params.characterName,
          fields: ['items', 'pvp', 'achievements']
        },
        */

        // Getting character from bnet API
        var url = 'https://eu.api.battle.net/wow/character/Ysondre/';
        var fields = '?fields=items%2Cpvp%2Cachievements%2Cprofessions%2Ctalents';
        var locale = '&locale=fr_FR';
        var apikey = '&apikey=tpkmytrfpdp2casqurxt24z8ub5u4khn';
        request(url + encodeURI(character.name) + fields + locale + apikey, function (err, response, body) {
            if(err) { return res.send(err); }
            body = JSON.parse(body);

            // Don't update if nothing change since the last time
            if(character.lastModified == body.lastModified) {
              console.log('Character ' + character.name + ' is already up to date');
              return res.json({
                message: 'Character ' + character.name + ' is already up to date',
                lastModified: character.lastModified
              });
            }
            else {
                // Root
                character.lastModified = body.lastModified;
                character.class = body.class;
                character.race = body.race;
                character.gender = body.gender;
                character.level = body.level;
                character.achievementPoints = body.achievementPoints;
                character.thumbnail = body.thumbnail;
                // Items
                character.averageItemLevel = body.items.averageItemLevel;
                character.averageItemLevelEquipped = body.items.averageItemLevelEquipped;
                // PvP
                character.arena2v2Rating = body.pvp.brackets.ARENA_BRACKET_2v2.rating;
                character.arena2v2SeasonWon = body.pvp.brackets.ARENA_BRACKET_2v2.seasonWon;
                character.arena2v2SeasonLost = body.pvp.brackets.ARENA_BRACKET_2v2.seasonLost;
                character.arena3v3Rating = body.pvp.brackets.ARENA_BRACKET_3v3.rating;
                character.arena3v3SeasonWon = body.pvp.brackets.ARENA_BRACKET_3v3.seasonWon;
                character.arena3v3SeasonLost = body.pvp.brackets.ARENA_BRACKET_3v3.seasonLost;
                character.rbgRating = body.pvp.brackets.ARENA_BRACKET_RBG.rating;
                character.rbgSeasonWon = body.pvp.brackets.ARENA_BRACKET_RBG.seasonWon;
                character.rbgSeasonLost = body.pvp.brackets.ARENA_BRACKET_RBG.seasonLost;
                // Achievements - Proving Grounds
                character.provingGroundsDps = getProvingGroundsAchievements('dps', body.achievements.achievementsCompleted);
                character.provingGroundsTank = getProvingGroundsAchievements('tank', body.achievements.achievementsCompleted);
                character.provingGroundsHeal = getProvingGroundsAchievements('heal', body.achievements.achievementsCompleted);
                // Professions
                var profession1 = {};
                if(body.professions.primary[0]) {
                  profession1.name = body.professions.primary[0].name;
                  profession1.rank = body.professions.primary[0].rank;
                  profession1.max = body.professions.primary[0].max;
                }
                var profession2 = {};
                if(body.professions.primary[1]) {
                  profession2.name = body.professions.primary[1].name;
                  profession2.rank = body.professions.primary[1].rank;
                  profession2.max = body.professions.primary[1].max;
                }
                character.professions.push(profession1);
                character.professions.push(profession2);
                // Specs
                var spec1 = {};
                if(body.talents[0].spec) {
                  spec1.name = body.talents[0].spec.name;
                  spec1.selected = body.talents[0].selected;
                }
                var spec2 = {};
                if(body.talents[1].spec) {
                  spec2.name = body.talents[1].spec.name;
                  spec2.selected = body.talents[1].selected;
                }
                character.specs.push(spec1);
                character.specs.push(spec2);
                updateCharacterCallback(character);
            }
        });
    });

    function updateCharacterCallback(character) {
        character.save(function(errsave) {
            if (errsave) { return res.send(errsave); }
            console.log('Character ' + character.name + ' updated !');
            return res.json({
              message: 'Character ' + character.name + ' updated !',
              lastModified: character.lastModified
            });
        });
    }

    // dps - tank - heal
    function getProvingGroundsAchievements(type, achievementsCompleted) {
        switch(type) {
          case 'dps':
            if(achievementsCompleted.indexOf(9574) < 0) { // or
                if(achievementsCompleted.indexOf(9573) < 0) { // argent
                    if(achievementsCompleted.indexOf(9572) < 0) { // bronze
                        return 0;
                    } else { return 1; }
                } else { return 2; }
            } else { return 3; }
          break;

          case 'tank':
            if(achievementsCompleted.indexOf(9580) < 0) { // or
                if(achievementsCompleted.indexOf(9579) < 0) { // argent
                    if(achievementsCompleted.indexOf(9578) < 0) { // bronze
                        return 0;
                    } else { return 1; }
                } else { return 2; }
            } else { return 3; }
          break;

          case 'heal':
            if(achievementsCompleted.indexOf(9586) < 0) { // or
                if(achievementsCompleted.indexOf(9585) < 0) { // argent
                    if(achievementsCompleted.indexOf(9584) < 0) { // bronze
                        return 0;
                    } else { return 1; }
                } else { return 2; }
            } else { return 3; }
          break;
        }
    }
});

/**
 * Drop one
 */
characterApiRouter.route('/drop/:characterName').get(function(req, res) {
  var characterToDrop = req.params.characterName;
  console.log('Dropping character ' + characterToDrop + '...');
  Character.remove({ 'name': characterToDrop }, function(err) {
      if (err) { return res.send(err); }
      console.log( 'Character ' + characterToDrop + ' dropped.');
      return res.send({ message: 'Character ' + characterToDrop + ' dropped.' });
  });
});

/**
 * Drop collection
 */
characterApiRouter.route('/drop').get(function(req, res) {
  console.log('Dropping character collection...');
  Character.remove({}, function(err) {
      if (err) { return res.send(err); }
      console.log('Character collection dropped.')
      return res.send({ message: 'Character collection dropped' });
  });
});


module.exports = characterApiRouter;
