// models/token.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    lastUpdate: Number,
    value: Number
});

module.exports = mongoose.model('Token', TokenSchema);
