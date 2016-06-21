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
    arena5v5Rating: Number
});

module.exports = mongoose.model('Character', CharacterSchema);
