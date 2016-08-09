// models/progress.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProgressSchema = new Schema({
    emeraldNightmare : [
      { name: String, difficulty: Number }
    ],
    nighthold : [
      { name: String, difficulty: Number }
    ]
});

module.exports = mongoose.model('Progress', ProgressSchema);
