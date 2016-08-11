// models/progress.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProgressSchema = new Schema({
    lastUpdate: Number,
    emeraldNightmare : [
      {
        bossName: String,
        downs: [
          {
            difficulty: Number,
            timestamp: Number
          }
        ]
      }
    ],
    nighthold : [
      {
        bossName: String,
        downs: [
          {
            difficulty: Number,
            timestamp: Number
          }
        ]
      }
    ]
});

module.exports = mongoose.model('Progress', ProgressSchema);
