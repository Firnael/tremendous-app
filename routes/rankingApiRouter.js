var request = require('request');
var express = require('express');
var async = require('async');
var rankingApiRouter = express.Router();
// Models
var Ranking = require('../models/ranking');
// Data
var scraperUri = 'https://storage.scrapinghub.com/items/162829/1/';
var apiKeyUri = '?apikey=8215dde3dcc941bf92f772fd973abaee';
// https://app.scrapinghub.com/p/162829/1
// https://portia.scrapinghub.com/#/projects/162829?url=https%3A%2F%2Fwww.wowprogress.com%2Fpve%2Feu%2Fysondre

/**
 * Get server guilds ranking (Server, Region and World)
 */
rankingApiRouter.get('/', function(req, res) {
  Ranking.findOne({}, function (err, ranking) {
    if (err) { res.send(err); return; }
    return res.send(ranking);
  });
});

/**
 * Update and return ranking
 */
rankingApiRouter.get('/update', function(req, res) {
  Ranking.findOne({}, function(err, ranking) {
    if (err) { return res.send(err); }
    if(!ranking) {
      // Create new Ranking
      console.log('Ranking not found, creating...');
      ranking = new Ranking();
      ranking.jobId = 366;
      ranking.lastUpdate = 0;
    }
    if(Date.now() - ranking.lastUpdate >= 3600000) { // un jour écoulé
      console.log('Ranking too old, updating...');
      ranking.jobId++;
      ranking.lastUpdate = Date.now();
    } else {
      console.log('Ranking already up to date');
      return res.send(ranking);
    }

    var fullUrl = scraperUri + ranking.jobId + apiKeyUri;
    var options = { uri: fullUrl, method: 'GET', json: true };
    request(options, function (err, response, body) {
      if (err || response.statusCode !== 200) { return console.log(err); }
      ranking.guilds = getGuildsRankingData(body);

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
    var guildUrl = guild.url.replace('pve', 'guild') + '/' + encodeURI(guild.guildName[0]);
    data.push({
      name: guild.guildName[0],
      url: guildUrl,
      score: 0,
      worldRank: guild.worldRank ? guild.worldRank[0] : '',
      regionRank: 0,
      realmRank: guild.rank[0],
      emeraldNightmare: guild.enProgress[0],
      trialOfValor: guild.tovProgress[0],
      nighthold: guild.nhProgress[0]
    });
  }
  return data;
}

function getGuildRanking(guild, asyncCallback) {
  var rankingUrl = guild.url + "/json_rank";
  request(rankingUrl, function (err, response, body) {
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
