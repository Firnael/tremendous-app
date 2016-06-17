// models/guild.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GuildSchema = new Schema({
    lastModified: Number,
    name: String,
    level: Number,
    achievementPoints: Number,
    members : [
      { name: String, rank: Number }
    ],
});

module.exports = mongoose.model('Guild', GuildSchema);
