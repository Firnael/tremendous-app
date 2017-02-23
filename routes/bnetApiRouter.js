var express = require('express');
var httpRequest = require('request');
var blizzard = require('blizzard.js').initialize({ apikey: process.env.BNET_STRATEGY_CLIENT_ID });
var bnetApiRouter = express.Router();


bnetApiRouter.get('/characters/:token', function(req, res) {
  console.log('User access token : ' + req.params.token);
  blizzard.account.wow({ access_token: req.params.token, origin: 'eu' }).then(function(response) {
    console.log(response);
  });
});


module.exports = bnetApiRouter;
