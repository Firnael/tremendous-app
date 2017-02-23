// models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    lastUpdate: Number,
    battletag: String,
    token: String,
    characters: [String]
});

module.exports = mongoose.model('User', UserSchema);
