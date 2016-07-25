// models/character.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    lastModified: Number,
    name: String,
    guildRank: Number,
    class: Number,
    race: Number,
    gender: Number,
    level: Number,
    achievementPoints: Number,
    thumbnail: String,
    averageItemLevel: Number,
    averageItemLevelEquipped: Number,
    arena2v2Rating: Number,
    arena3v3Rating: Number,
    provingGroundsDps: Number,
    provingGroundsTank: Number,
    provingGroundsHeal: Number,
    professions : [
      { name: String, rank: Number, max: Number }
    ],
    specs : [
      { name: String, selected: Boolean }
    ],
    accountIdentifier: Number
});

module.exports = mongoose.model('Character', CharacterSchema);
