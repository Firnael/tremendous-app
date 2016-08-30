var express = require('express');
var request = require('request');
var async = require('async');
var bnet = require('battlenet-api')('tpkmytrfpdp2casqurxt24z8ub5u4khn');
var characterApiRouter = express.Router();
// Models
var Character = require('../models/character');
var Guild = require('../models/guild');
var Progress = require('../models/progress');
// Data
var guildName = 'Tremendous';
var forceUpdate = true;


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
                  var accountId = member.rank !== 5 ? Math.floor(Math.random() * 10000000000) : 0;
                  console.log(member.name + ', ' + member.rank + ', ' + accountId);
                  newCharacter.role = 2;
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
  getByGuildRank([0, 1, 2, 3, 4, 6], res);
});

/**
 * Get roster
 */
characterApiRouter.route('/roster').get(function (req, res) {
  getByGuildRank([0, 1, 2, 3], res);
});

/**
 * Get rerolls
 */
characterApiRouter.route('/rerolls').get(function(req, res) {
  getByGuildRank([5], res);
});

function getByGuildRank(rankArray, res) {
  Character.where('guildRank').in(rankArray).exec(function (err, characters) {
    if (err) { res.send(err); return; }
    res.send(characters);
  });
}

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
 * Update roster characters
 */
characterApiRouter.route('/update-roster').get(function(req, res) {
  Character.where('guildRank').in([0, 1, 2, 3]).exec(function (err, characters) {
    if (err) { res.send(err); return; }

    async.each(characters, function (character, updateRosterAsyncCallback) {
      updateCharacter(character.name, updateRosterAsyncCallback);
    },
    function (errUpdateRosterAsync) {
        if(errUpdateRosterAsync) { res.send(errUpdateRosterAsync); }
        console.log('Roster updated');
        res.send({ message: 'Roster updated' });
    });

  });
});

function updateCharacter(characterName, callback) {
  console.log('Updating ' + characterName);
  callback();
}

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
            if(character.lastModified == body.lastModified && !forceUpdate) {
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
              if(body.items) {
                character.averageItemLevel = body.items.averageItemLevel;
                character.averageItemLevelEquipped = body.items.averageItemLevelEquipped;
                character.items = getItemsData(body.items);
                // Audit
                character.audit = getAuditData(body.items);
              }
              // PvP
              if(body.pvp) {
                character.arena2v2Rating = body.pvp.brackets.ARENA_BRACKET_2v2.rating;
                character.arena2v2SeasonWon = body.pvp.brackets.ARENA_BRACKET_2v2.seasonWon;
                character.arena2v2SeasonLost = body.pvp.brackets.ARENA_BRACKET_2v2.seasonLost;
                character.arena3v3Rating = body.pvp.brackets.ARENA_BRACKET_3v3.rating;
                character.arena3v3SeasonWon = body.pvp.brackets.ARENA_BRACKET_3v3.seasonWon;
                character.arena3v3SeasonLost = body.pvp.brackets.ARENA_BRACKET_3v3.seasonLost;
                character.rbgRating = body.pvp.brackets.ARENA_BRACKET_RBG.rating;
                character.rbgSeasonWon = body.pvp.brackets.ARENA_BRACKET_RBG.seasonWon;
                character.rbgSeasonLost = body.pvp.brackets.ARENA_BRACKET_RBG.seasonLost;
              }
              // Achievements
              if(body.achievements) {
                // -- Proving Grounds
                character.provingGroundsDps = getProvingGroundsAchievements('dps', body.achievements.achievementsCompleted);
                character.provingGroundsTank = getProvingGroundsAchievements('tank', body.achievements.achievementsCompleted);
                character.provingGroundsHeal = getProvingGroundsAchievements('heal', body.achievements.achievementsCompleted);
              }
              // Professions
              if(body.professions) {
                character.professions = getProfessionsData(body.professions);
              }
              // Specs
              if(body.talents) {
                character.specs = getSpecsData(body.talents);
              }

              // Save
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

    function getProfessionsData(professions) {
      var data = [];
      // -- Primary
      var primaryProfession1 = extractProfessionData(professions.primary[0], true);
      var primaryProfession2 = extractProfessionData(professions.primary[1], true);
      data.push(primaryProfession1);
      data.push(primaryProfession2);

      //-- Secondary
      var secondaryProfession1 = extractProfessionData(professions.secondary[0], false);
      var secondaryProfession2 = extractProfessionData(professions.secondary[1], false);
      var secondaryProfession3 = extractProfessionData(professions.secondary[2], false);
      var secondaryProfession4 = extractProfessionData(professions.secondary[3], false);
      data.push(secondaryProfession1);
      data.push(secondaryProfession2);
      data.push(secondaryProfession3);
      data.push(secondaryProfession4);
      return data;
    }

    function extractProfessionData(profession, primary) {
      var data = {};
      if(profession) {
        data.name = profession.name;
        data.rank = profession.rank;
        data.max = profession.max;
        data.primary = primary;
      }
      return data;
    }

    function getItemsData(items) {
      var data = [];
      data.push(extractItemData(items.head, 'head'));
      data.push(extractItemData(items.neck, 'neck'));
      data.push(extractItemData(items.shoulder, 'shoulder'));
      data.push(extractItemData(items.back, 'back'));
      data.push(extractItemData(items.chest, 'chest'));
      data.push(extractItemData(items.wrist, 'wrist'));
      data.push(extractItemData(items.hands, 'hands'));
      data.push(extractItemData(items.waist, 'waist'));
      data.push(extractItemData(items.legs, 'legs'));
      data.push(extractItemData(items.feet, 'feet'));
      data.push(extractItemData(items.finger1, 'finger1'));
      data.push(extractItemData(items.finger2, 'finger2'));
      data.push(extractItemData(items.trinket1, 'trinket1'));
      data.push(extractItemData(items.trinket2, 'trinket2'));
      data.push(extractItemData(items.mainHand, 'mainHand'));
      data.push(extractItemData(items.offHand, 'offHand'));
      return data;
    }

    function extractItemData(item, slot) {
      var data = {};
      if(item) {
        data.slot = slot;
        data.id = item.id;
        data.quality = item.quality;
        data.ilvl = item.itemLevel;
      }
      return data;
    }

    function getAuditData(items) {
      var data = {};
      var missingEnchants = 0;
      var gemSlots = 0;
      var equipedGems = 0;
      var equipedSetPieces = 0;

      for(var key in items) {
        var item = {};
        if(items.hasOwnProperty(key) && items[key].id) { // focus the slots
          item = items[key];
        } else {
          continue;
        }

        // Check enchants
        if(['neck', 'back', 'finger1', 'finger2'].indexOf(key) >= 0) {
          if(!item.tooltipParams.enchant) {
            missingEnchants++;
          }
        }

        // Check gems
        if(item.bonusLists) {
          if(item.bonusLists.indexOf(564) >= 0 || item.bonusLists.indexOf(565) >= 0) {
            gemSlots++;
            // Item has gem socket
            if(item.tooltipParams.gem0) {
              equipedGems++;
            }
          }
        }

        // Check set pieces
        if(item.tooltipParams.set) {
          equipedSetPieces = item.tooltipParams.set.length;
        }
      }

      data.missingEnchants = missingEnchants;
      data.gemSlots = gemSlots;
      data.equipedGems = equipedGems;
      data.equipedSetPieces = equipedSetPieces;
      return data;
    }

    function getSpecsData(talents) {
      var data = [];

      if(talents) {
        if(talents[0].spec) {
          var spec1 = {};
          spec1.name = talents[0].spec.name;
          spec1.selected = talents[0].selected;
          data.push(spec1);
        }

        if(talents[1].spec) {
          var spec2 = {};
          spec2.name = talents[1].spec.name;
          spec2.selected = talents[1].selected;
          data.push(spec2);
        }
      }
      
      return data;
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
