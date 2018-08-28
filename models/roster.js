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
    tanks: [
      { classId: Number, count: Number }
    ],
    healers: [
      { classId: Number, count: Number }
    ]
});

module.exports = mongoose.model('Roster', RosterSchema);
