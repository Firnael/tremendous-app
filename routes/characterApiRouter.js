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


// TODO REMOVE
characterApiRouter.route('/createhyrm').get(function(req, res) {
    var character = new Character();
    character.name = 'Hyrm';
    character.save(function(err) {
        if (err) { res.send(err); }
        res.json({ message: 'Character ' + character.name + ' created !' });
    });
})

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
                  newCharacter.save(function(errcreate) {
                      if (errcreate) { res.send(errcreate); }
                      overrideCallback(true, member.name, asyncAddCallback);
                  });
              } else {
                overrideCallback(null, null, asyncAddCallback);
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
        var fields = '?fields=items%2Cpvp%2Cachievements%2Cprofessions';
        var locale = '&locale=fr_FR';
        var apikey = '&apikey=tpkmytrfpdp2casqurxt24z8ub5u4khn';
        request(url + encodeURI(character.name) + fields + locale + apikey, function (err, response, body) {
            if(err) { res.send(err); }
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
                character.arena3v3Rating = body.pvp.brackets.ARENA_BRACKET_3v3.rating;
                character.arena5v5Rating = body.pvp.brackets.ARENA_BRACKET_5v5.rating;
                // Achievements - Proving Grounds
                character.provingGroundsDps = getProvingGroundsAchievements('dps', body.achievements.achievementsCompleted);
                character.provingGroundsTank = getProvingGroundsAchievements('tank', body.achievements.achievementsCompleted);
                character.provingGroundsHeal = getProvingGroundsAchievements('heal', body.achievements.achievementsCompleted);
                // Professions
                var profession1 = {};
                profession1.name = body.professions.primary[0].name;
                profession1.rank = body.professions.primary[0].rank;
                profession1.max = body.professions.primary[0].max;
                var profession2 = {};
                profession2.name = body.professions.primary[1].name;
                profession2.rank = body.professions.primary[1].rank;
                profession2.max = body.professions.primary[1].max;
                character.professions.push(profession1);
                character.professions.push(profession2);

                character.save(function(errsave) {
                    if (errsave) { return res.send(errsave); }
                    console.log('Character ' + character.name + ' updated !');
                    return res.json({
                      message: 'Character ' + character.name + ' updated !',
                      lastModified: character.lastModified
                    });
                });
            }
        });
    });

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
