// models/roster.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RosterSchema = new Schema({
    lastUpdate: Number,
    size: Number,
    averageItemLevel: Number,
    lowestItemLevel: Number,
    highestItemLevel: Number,
    classes: [
      { classId: Number, count: Number }
    ],
    armorTypes: {
      cloth: Number,
      leather: Number,
      mail: Number,
      plate: Number
    },
    meleeVsDistant: {
      melee: Number,
      distant: Number
    }
});

module.exports = mongoose.model('Roster', RosterSchema);
