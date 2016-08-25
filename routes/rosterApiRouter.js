var express = require('express');
var rosterApiRouter = express.Router();
// Models
var Roster = require('../models/roster');
var Character = require('../models/character');

/**
 * Get roster infos
 */
rosterApiRouter.get('/', function(req, res) {
  Roster.findOne({}, function (err, roster) {
    if (err) { return res.send(err); }
    res.json(roster);
  });
});

/**
 * Update roster infos
 */
rosterApiRouter.get('/update', function(req, res) {
  Character.where('guildRank').in([0, 1, 2, 3]).exec(function (err, characters) {
    if (err) { return res.send(err); }

    Roster.remove({}, function(err) {
      if (err) { return res.send(err); }

      // Create new Roster
      var roster = new Roster();
      roster.lastUpdate = new Date().getTime();
      roster.size = characters.length;

      var data = getRosterData(characters);
      roster.averageItemLevel = data.averageItemLevel;
      roster.lowestItemLevel = data.lowestItemLevel;
      roster.highestItemLevel = data.highestItemLevel;
      roster.classes = data.classes;
      roster.armorTypes = data.armorTypes;
      roster.armorTokens = data.armorTokens;
      roster.meleeVsDistant = data.meleeVsDistant;

      // Save it
      roster.save(function(errsave) {
        if (errsave) { return res.send(errsave); }
        console.log('Roster updated');
        return res.send(roster);
      });
    });
  });
});

function getRosterData(characters) {
  var totalItemLevel = 0;
  var data = {
    averageItemLevel: 0,
    lowestItemLevel: 0,
    highestItemLevel: 0,
    classes: [],
    armorTypes: {
      cloth: 0,
      leather: 0,
      mail: 0,
      plate: 0
    },
    armorTokens: {
      vanquisher: 0,
      protector: 0,
      conqueror: 0
    },
    meleeVsDistant: {
      melee: 0,
      distant: 0
    }
  };

  // To store classes counts temporary
  var classesTmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Do work
  for(var i=0; i<characters.length; i++) {
    var character = characters[i];
    totalItemLevel += character.averageItemLevel;

    // Lowest ilvl
    if(data.lowestItemLevel !== 0) {
      if(data.lowestItemLevel > character.averageItemLevel) {
        data.lowestItemLevel = character.averageItemLevel;
      }
    } else {
      data.lowestItemLevel = character.averageItemLevel;
    }

    // Highest ilvl
    if(data.highestItemLevel !== 0) {
      if(data.highestItemLevel < character.averageItemLevel) {
        data.highestItemLevel = character.averageItemLevel;
      }
    } else {
      data.highestItemLevel = character.averageItemLevel;
    }

    // Armor types
    switch(character.class) {
      case 5: case 8: case 9:
        data.armorTypes.cloth++; break;
      case 4: case 10: case 11: case 12:
        data.armorTypes.leather++; break;
      case 3: case 7:
        data.armorTypes.mail++; break;
      case 1: case 2: case 6:
        data.armorTypes.plate++; break;
    }

    // Armor tokens
    switch(character.class) {
      case 1: case 3: case 7: case 10: // Warrior, Hunter, Shaman, Monk
        data.armorTokens.protector++; break;
      case 2: case 5: case 9: case 12: // Paladin, Priest, Warlock, Demon Hunter
        data.armorTokens.conqueror++; break;
      case 4: case 6: case 8: case 11: // Rogue, Death Knight, Mage, Druid
        data.armorTokens.vanquisher++; break;
    }

    // Classes
    // Melee vs Distant
    switch(character.class) {
      case 1: classesTmp[1]++; data.meleeVsDistant.melee++; break; // war
      case 2: classesTmp[2]++; data.meleeVsDistant.melee++; break; // pal
      case 3: classesTmp[3]++; data.meleeVsDistant.distant++; break; // hunt
      case 4: classesTmp[4]++; data.meleeVsDistant.melee++; break; // rogue
      case 5: classesTmp[5]++; data.meleeVsDistant.distant++; break; // priest
      case 6: classesTmp[6]++; data.meleeVsDistant.melee++; break; // dk
      case 7: classesTmp[7]++; break; // cham
      case 8: classesTmp[8]++; data.meleeVsDistant.distant++; break; // mage
      case 9: classesTmp[9]++; data.meleeVsDistant.distant++; break; // warlock
      case 10: classesTmp[10]++; break; // monk
      case 11: classesTmp[11]++; break; // druid
      case 12: classesTmp[12]++; data.meleeVsDistant.melee++; break; // dh
    }
  }

  // Classes distribution
  for(var i=1; i<classesTmp.length; i++) {
    data.classes.push({ classId: i, count: classesTmp[i] });
  }

  // Average ilvl
  data.averageItemLevel = (totalItemLevel / characters.length).toFixed(1);

  return data;
}


module.exports = rosterApiRouter;
