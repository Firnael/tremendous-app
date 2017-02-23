var express = require('express');
var httpRequest = require('request');
var blizzard = require('blizzard.js').initialize({ apikey: process.env.BNET_STRATEGY_CLIENT_ID });
var userApiRouter = express.Router();
// Models
var User = require('../models/user');
// Data
var SERVER = 'Ysondre';
var GUILD = 'Tremendous';


userApiRouter.post('/refresh', function(req, res) {
  var profile = req.body;
  User.findOne({ 'battletag': profile.battletag }, function (err, user) {
    if (err) { return res.send(err); }
    if(!user) {
      console.log('User ' + profile.battletag + ' doesnt exist, creating.');
      user = new User();
      user.battletag = profile.battletag;
      user.characters = [];
    }
    user.lastUpdate = Date.now();
    user.token = profile.token;

    // Retrieve character list
    blizzard.account.wow({ access_token: profile.token, origin: 'eu' }).then(function(response) {
      var data = extractCharacters(response.data.characters);
      if(data.length === 0) {
        console.log('No character in guild, gtfo !');
        return res.sendStatus(403);
      }
      user.characters = compareCharacters(user.characters, data);

      // Save user
      user.save(function(errsave) {
        if (errsave) { return res.send(errsave); }
        console.log('User ' + user.battletag + ' refreshed');
        return res.sendStatus(200);
      });
    });
  });
});

function extractCharacters(characters) {
  var extractedCharacters = [];
  for(var i=0; i<characters.length; i++) {
    var character = characters[i];
    if(character.realm === SERVER && character.guild === GUILD) {
      extractedCharacters.push(character.name);
    }
  }
  return extractedCharacters;
}

function compareCharacters(arrayFromDb, arrayFromBnet) {
  // Check if account is new (no characters yet)
  if(arrayFromDb.length === 0) {
    return arrayFromBnet;
  }
  // Add new characters
  for(var j=0; j<arrayFromBnet.length; j++) {
    var charToCompare = arrayFromBnet[j];
    if(!arrayFromDb.contains(charToCompare)) {
      arrayFromDb.push(charToCompare);
    }
  }
  // Remove deleted / migrated characters
  for(var k=0; k<arrayFromDb.length; k++) {
    var charToRemove = arrayFromDb[k];
    if(!arrayFromBnet.contains(charToRemove)) {
      arrayFromDb.splice(k, 1);
    }
  }
  return arrayFromDb;
}


module.exports = userApiRouter;
