// models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    lastUpdate: Number,
    battletag: String,
    token: String,
    characters: [String],
    thumbnail: { type: String, default: '' },
    needToMatch: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
