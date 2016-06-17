// models/guild.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GuildSchema = new Schema({
    lastModified: Number,
    name: String
});

module.exports = mongoose.model('Guild', GuildSchema);
