var request = require('request');
var express = require('express');
var wowTokenApiRouter = express.Router();
// Models
var Token = require('../models/token');
// Data
var url = "https://wowtoken.info/wowtoken.json";


/**
 * Update if needed and returns current EU token value
 */
wowTokenApiRouter.get('/', function(req, res) {
  Token.findOne({}, function (err, token) {
    if (err) { return res.send(err); }
    if(!token) {
      token = new Token();
      token.lastUpdate = 0;
      token.value = 0;
    }
    if(Date.now() > token.lastUpdate + (3600000)) { // last update is at least 1hour old
      console.log('Token data at least one hour old, updating...');
      request(url, function (err, response, body) {
        if (err || response.statusCode !== 200) { return console.log(err); }
        var data = JSON.parse(body);
        token.lastUpdate = Date.now();
        token.value = data.update.EU.raw.buy;
        token.save(function(errsave) {
          if (errsave) { return res.send(errsave); }
          console.log('Token data updated');
        });
      });
    }
    return res.send(token);
  });
});

module.exports = wowTokenApiRouter;
