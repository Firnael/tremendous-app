var request = require('request');
var express = require('express');
var async = require('async');
var rankingApiRouter = express.Router();
// Models
var Ranking = require('../models/ranking');
// Data
var guildListUrl = "https://extraction.import.io/query/extractor/5482b056-6980-4082-af5a-8de7e1c5d138?_apikey=57b7550f7ae349e9b41555ab1c2a00e8c0891167a8ae8f6c4d3b4851d63b7e96f494aaececc0e20602025e5700ed6172577b11a6e19fe884244a86895809cb174ec909632690b704988daddfdb021fbb&url=http%3A%2F%2Fwww.wowprogress.com%2Fpve%2Feu%2Fysondre";

/**
 * Get server guilds ranking (Server, Region and World)
 */
rankingApiRouter.get('/update', function(req, res) {
  request(guildListUrl, function (err, response, body) {
    if (err || response.statusCode !== 200) { return console.log(err); }
    var result = JSON.parse(body).extractorData.data[0].group;

    Ranking.remove({}, function(err) {
      if (err) { return res.send(err); }

      // Create new Ranking
      var ranking = new Ranking();
      ranking.lastUpdate = new Date().getTime();
      ranking.guilds = getGuildsRankingData(result);

      // Get specific region & score ranking
      async.each(ranking.guilds, function (guild, asyncCallback) {
        getGuildRanking(guild, asyncCallback);
      },
      function (errAsync) {
        if(errAsync) { return res.send(errAsync); }

        // Save ranking
        ranking.save(function(errsave) {
          if (errsave) { return res.send(errsave); }
          console.log('Ranking updated');
          return res.send(ranking);
        });
      });
    });
  });
});

function getGuildsRankingData(result) {
  var data = [];
  for(var i=0; i<result.length; i++) {
    var guild = result[i];
    data.push({
      name: guild['guild'][0]['text'],
      url: guild['guild'][0]['href'],
      score: 0,
      worldRank: guild['world_rank'][0]['text'],
      regionRank: 0,
      realmRank: guild['rank'][0]['text'],
      tierProgress: guild['progress'][0]['text']
    });
  }
  return data;
}

function getGuildRanking(guild, asyncCallback) {
  var url = guild.url + "/json_rank";
  request(url, function (err, response, body) {
    if (err || response.statusCode !== 200) { return res.send(body); }
    var result = JSON.parse(body);

    if(result) {
      guild.score = result.score;
      guild.regionRank = result.area_rank;
    }

    return asyncCallback();
  });
}

module.exports = rankingApiRouter;
