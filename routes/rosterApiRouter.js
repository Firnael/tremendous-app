var express = require('express');
var rosterApiRouter = express.Router();
// Models
var Roster = require('../models/roster');
var Character = require('../models/character');
// Data
var ranks = [0, 1, 2, 3, 4];

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
  Character.where('guildRank').in(ranks).exec(function (err, characters) {
    if (err) { return res.send(err); }

    // Delete old
    Roster.remove({}, function(err) {
      if (err) { return res.send(err); }

      // Create new
      var roster = new Roster();
      roster.lastUpdate = new Date().getTime();
      roster.size = characters.length;

      var data = getRosterData(characters);
      roster.averageItemLevel = data.averageItemLevel;
      roster.lowestItemLevel = data.lowestItemLevel;
      roster.highestItemLevel = data.highestItemLevel;
      roster.classes = data.classes;
      roster.tanks = data.tanks;
      roster.healers = data.healers;
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
    tanks: [],
    healers: [],
    meleeVsDistant: {
      melee: 0,
      distant: 0
    }
  };

  // To store counts temporary
  var classesTmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var tanksTmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var healersTmp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Do work
  var skippedCharacters = 0;
  for(var i=0; i<characters.length; i++) {
    var character = characters[i];

    // Fail-safe if character data is absent
    if(!character.averageItemLevelEquipped) {
      console.log('Roster infos update : skipping ' + character.name);
      skippedCharacters++;
      continue;
    }

    totalItemLevel += character.averageItemLevelEquipped;

    // Lowest ilvl
    if(data.lowestItemLevel !== 0) {
      if(data.lowestItemLevel > character.averageItemLevelEquipped) {
        data.lowestItemLevel = character.averageItemLevelEquipped;
      }
    } else {
      data.lowestItemLevel = character.averageItemLevelEquipped;
    }

    // Highest ilvl
    if(data.highestItemLevel !== 0) {
      if(data.highestItemLevel < character.averageItemLevelEquipped) {
        data.highestItemLevel = character.averageItemLevelEquipped;
      }
    } else {
      data.highestItemLevel = character.averageItemLevelEquipped;
    }

    // Classes
    // Tanks & healers
    // Melee vs Distant => specs[x].selected = true
    switch(character.class) {
      case 1: // war
        if(character.role === 0) { tanksTmp[1]++ };
        classesTmp[1]++;
        data.meleeVsDistant.melee++;
        break;
      case 2: // pal
        if(character.role === 0) { tanksTmp[1]++ }
        else if(character.role === 1) { healersTmp[2]++ };
        classesTmp[2]++;
        data.meleeVsDistant.melee++;
        break;
      case 3: classesTmp[3]++; data.meleeVsDistant.distant++; break; // hunt
      case 4: classesTmp[4]++; data.meleeVsDistant.melee++; break; // rogue
      case 5: // priest
        if(character.role === 1) { healersTmp[5]++ };
        classesTmp[5]++;
        data.meleeVsDistant.distant++;
        break; 
      case 6: // dk
        if(character.role === 0) { tanksTmp[6]++ }
        classesTmp[6]++;
        data.meleeVsDistant.melee++;
        break;
      case 7: // cham
        if(character.role === 1) { healersTmp[7]++ }
        classesTmp[7]++;
        break;
      case 8: classesTmp[8]++; data.meleeVsDistant.distant++; break; // mage
      case 9: classesTmp[9]++; data.meleeVsDistant.distant++; break; // warlock
      case 10: // monk
        if(character.role === 0) { tanksTmp[10]++ }
        else if(character.role === 1) { healersTmp[10]++ };
        classesTmp[10]++;
        break;
      case 11: // druid
        if(character.role === 0) { tanksTmp[11]++ }
        else if(character.role === 1) { healersTmp[11]++ };
        classesTmp[11]++;
        break;
      case 12: // dh
        if(character.role === 0) { tanksTmp[12]++ }
        classesTmp[12]++;
        data.meleeVsDistant.melee++;
        break;
    }
  }

  // Classes distribution
  for(var i=1; i<classesTmp.length; i++) {
    data.classes.push({ classId: i, count: classesTmp[i] });
  }
  // Tanks distribution
  for(var i=1; i<tanksTmp.length; i++) {
    data.tanks.push({ classId: i, count: tanksTmp[i] });
  }
  // Healers distribution
  for(var i=1; i<healersTmp.length; i++) {
    data.healers.push({ classId: i, count: healersTmp[i] });
  }

  // Average ilvl
  data.averageItemLevel = (totalItemLevel / (characters.length - skippedCharacters)).toFixed(1);

  return data;
}


module.exports = rosterApiRouter;
