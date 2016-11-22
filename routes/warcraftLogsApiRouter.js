var request = require('request');
var express = require('express');
var warcraftLogsApiRouter = express.Router();
// Data
var key = "a5d4d1f280318807615b920121493cde";
var url = "https://www.warcraftlogs.com:443/v1/reports/guild/Tremendous/Ysondre/EU?api_key=" + key;


/**
 * Get all logs
 */
warcraftLogsApiRouter.get('/', function(req, res) {
  request(url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      return res.send(body);
    } else {
      console.log(err);
    }
  })
});


module.exports = warcraftLogsApiRouter;
