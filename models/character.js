// models/character.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
    name: String,
    guildRank: Number
});

module.exports = mongoose.model('Character', CharacterSchema);
