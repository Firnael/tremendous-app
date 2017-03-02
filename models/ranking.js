// models/ranking.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RankingSchema = new Schema({
    lastUpdate: Number,
    guilds: [
      {
        name: String,
        url: String,
        score: Number,
        worldRank: Number,
        regionRank: Number,
        realmRank: Number,
        emeraldNightmare: String,
        trialOfValor: String,
        nighthold: String
      }
    ]
});

module.exports = mongoose.model('Ranking', RankingSchema);
