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
  getByGuildRank([0, 1, 2, 3, 4, 5], res);
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
  getByGuildRank([6], res);
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
 * Get character with usefull recipes
 */
 characterApiRouter.route('/with-recipes').get(function(req, res) {
   Character.find({ recipes: { $gt: [] } })
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
        var fields = '?fields=items%2Cpvp%2Cachievements%2Cprofessions%2Ctalents%2Creputation%2Cfeed';
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
                character.artifactTraits = getArtifactTraitsCount(body.items.mainHand);
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
              // Professions & Recipes
              if(body.professions) {
                character.professions = getProfessionsData(body.professions);
                character.recipes = getRecipesData(body.professions);
              }
              // Specs
              if(body.talents) {
                character.specs = getSpecsData(body.talents);
              }
              // Reputations
              if(body.reputation) {
                character.reputations = getReputationsData(body.reputation);
              }
              // Mythic dungeon tags
              if(body.feed) {
                character.mythicDungeonTags = getFeedData(body.feed, character.mythicDungeonTags);
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

    function getRecipesData(professions) {
      var alchemy;
      if(professions.primary[0].id === 171) {
        alchemy = professions.primary[0];
      } else if(professions.primary[1].id === 171) {
        alchemy = professions.primary[1];
      }

      if(!alchemy) {
        return;
      }
      return alchemy.recipes;
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

    function getArtifactTraitsCount(artifact) {
      var result = 0;
      if(artifact.artifactTraits) {
        for(var i=0; i<artifact.artifactTraits.length; i++) {
          var trait = artifact.artifactTraits[i];
          result += trait.rank;
        }
      }
      return result;
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
          if(item.bonusLists.indexOf(1808) >= 0) {
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

    function getReputationsData(reputations) {
      var data = [];
      var legionReputations = [
        1828, // Tribu de Haut-Roc (Haut-Roc)
        1883, // Tisse-rêves (Val'sharah)
        1888, // Vrykul de Jandvik / Valarjar (Stormheim)
        1894, // Les Gardiennes (Île du Guet - Azsuna)
        1900, // Cour de Farondis (Azsuna)

        // 1899, // Gardes de la lune

        1860, // Soif des Arcanes - Thalyssra (Souffrenuits)
        1862, // Soif des Arcanes - Oculeth (Souffrenuits)
        1919, // Soif des Arcanes - Valtrois (Souffrenuits)

        1975, // Adjurateur Margoss (Pêche)
        1984  // Les Guérisseuses (Secourisme)
      ];

      for(var i=0; i<reputations.length; i++) {
        var reput = reputations[i];
        if(legionReputations.indexOf(reput.id) >= 0) {
          data.push({
            name: reput.name,
            standing: reput.standing,
            current: reput.value,
            max: reput.max
          });
        }
      }

      return data;
    }

    function getFeedData(feed, tags) {
      if(typeof tags.count === 'undefined') {
        tags = {};
        tags.count = 0;
        tags.dungeons = {};
        tags.dungeons[8040] = 0; // Oeil d'Azshara
        tags.dungeons[7673] = 0; // Fourré Sombrecoeur
        tags.dungeons[7672] = 0; // Salles des Valeureux
        tags.dungeons[7546] = 0; // Repaire de Neltharion
        tags.dungeons[7996] = 0; // Assaut sur le fort Pourpre
        tags.dungeons[7787] = 0; // Caveau des Gardiennes
        tags.dungeons[7805] = 0; // Bastion du Freux
        tags.dungeons[7812] = 0; // La Gueule des âmes
        tags.dungeons[7855] = 0; // L'Arcavia
        tags.dungeons[8079] = 0; // La Cour des étoiles
      }

      var achievementIds = [];
      achievementIds[10782] = 8040;
      achievementIds[10785] = 7673;
      achievementIds[10789] = 7672;
      achievementIds[10797] = 7546;
      achievementIds[10800] = 7996;
      achievementIds[10803] = 7787;
      achievementIds[10806] = 7805;
      achievementIds[10809] = 7812;
      achievementIds[10813] = 7855;
      achievementIds[10816] = 8079;

      var bossKillIds = [];
      bossKillIds[10880] = 8040;
      bossKillIds[10883] = 7673;
      bossKillIds[10889] = 7672;
      bossKillIds[10886] = 7546;
      bossKillIds[10895] = 7996;
      bossKillIds[10898] = 7787;
      bossKillIds[10901] = 7805;
      bossKillIds[10904] = 7812;
      bossKillIds[10907] = 7855;
      bossKillIds[10910] = 8079;

      for(var i=0; i<feed.length; i++) {
        var element = feed[i];

        if(element.type === 'ACHIEVEMENT') {
          var id = String(element.achievement.id);
          var index = Object.keys(achievementIds).indexOf(id);
          if(index >= 0) {
            var realIndex = achievementIds[element.achievement.id];
            if(tags.dungeons[realIndex] < element.timestamp) {
              tags.dungeons[realIndex] = element.timestamp;
              tags.count++;
            }
          }
        }
        else if(element.type === 'BOSSKILL') {
          var id = String(element.achievement.id);
          var index = Object.keys(bossKillIds).indexOf(id);
          if(index >= 0) {
            var realIndex = String(bossKillIds[element.achievement.id]);
            if(tags.dungeons[realIndex] < element.timestamp) {
              tags.dungeons[realIndex] = element.timestamp;
              tags.count++;
            }
          }
        }
      }

      return tags;
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
