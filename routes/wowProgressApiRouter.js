var request = require('request');
var express = require('express');
var wowProgressApiRouter = express.Router();
// Data
var guildUrl = "http://www.wowprogress.com/guild/eu/ysondre/Millenium/json_rank";
var serverUrl = "https://extraction.import.io/query/extractor/5482b056-6980-4082-af5a-8de7e1c5d138?_apikey=57b7550f7ae349e9b41555ab1c2a00e8c0891167a8ae8f6c4d3b4851d63b7e96f494aaececc0e20602025e5700ed6172577b11a6e19fe884244a86895809cb174ec909632690b704988daddfdb021fbb&url=http%3A%2F%2Fwww.wowprogress.com%2Fpve%2Feu%2Fysondre";

/**
 * Get guild rank on server, region and world
 */
wowProgressApiRouter.get('/guild-rank', function(req, res) {
  request(guildUrl, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      res.send(body);
    } else {
      console.log(err);
    }
  });
});

/**
 * Get top 20 guilds ranking on server-ranking
 */
wowProgressApiRouter.get('/server-ranking', function(req, res) {
  request(serverUrl, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return console.log(err);
    }
    var result = JSON.parse(body).extractorData.data[0].group;
    res.send(result);
  });
});

module.exports = wowProgressApiRouter;
