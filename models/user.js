// models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    lastUpdate: Number,
    needToMatch: Boolean,
    battletag: String,
    token: String,
    characters: [String]
});

module.exports = mongoose.model('User', UserSchema);
