var express = require('express');
var httpRequest = require('request');
var async = require('async');
var blizzard = require('blizzard.js').initialize({ apikey: process.env.BNET_STRATEGY_CLIENT_ID });
var userApiRouter = express.Router();
// Models
var User = require('../models/user');
var Character = require('../models/character');
// Data
var SERVER = 'Ysondre';
var GUILD = 'Tremendous';


/**
 * Match user battletag with characters battletag
 */
userApiRouter.post('/match', function(req, res) {
  var battletag = req.body.battletag;
  User.findOne({ 'battletag': battletag }, function (err, user) {
    if (err) { return res.send(err); }
    var result = matchUserBattleTagWithCharactersAccountIdentifier(user);
    return res.sendStatus(result);
  });
});

/**
 * Refresh user profile on connection
 */
userApiRouter.post('/refresh', function(req, res) {
  var profile = req.body;
  User.findOne({ 'battletag': profile.battletag }, function (err, user) {
    if (err) { return res.send(err); }
    if(!user) {
      console.log('User ' + profile.battletag + ' doesnt exist, creating.');
      user = new User();
      user.battletag = profile.battletag;
      needToMatch = true;
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
      compareCharacters(user, data);

      // Match
      if(true) {
        console.log('Need to match user account with characters');
        matchUserWithCharacters(user);
        user.needToMatch = false;
      }

      // Save user
      user.save(function(errsave) {
        if (errsave) { return res.send(errsave); }
        console.log('User ' + user.battletag + ' refreshed');
        return res.sendStatus(200);
      });
    });
  });
});

function matchUserWithCharacters(user) {
  async.each(user.characters, function (characterName, asyncCallback) {
    Character.findOne({ 'name': characterName }, function(errFindChar, character) {
      if (errFindChar) { console.log(errFindChar); return 500; }
      if (character) {
        character.battletag = user.battletag;
        character.accountIdentifier = -1;
        character.lastModified = Date.now();
        character.save(function(errSaveChar) {
          if (errSaveChar) { console.log(errSaveChar); return 500; }
          console.log('Character ' + character.name + ' matched with the account ' + user.battletag);
          asyncCallback();
        });
      }
    });
  },
  function (errAsync) {
    if(errAsync) { console.log(errAsync); return 500; }
    console.log('Match done');
    return 200;
  });
}

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

function compareCharacters(user, arrayFromBnet) {
  var needToMatch = false;
  // Check if account is new (no characters yet)
  if(user.characters.length === 0) {
    return arrayFromBnet;
  }
  // Add new characters
  for(var j=0; j<arrayFromBnet.length; j++) {
    var charToCompare = arrayFromBnet[j];
    if(user.characters.indexOf(charToCompare) < 0) {
      user.characters.push(charToCompare);
      needToMatch = true;
    }
  }
  // Remove deleted / migrated characters
  for(var k=0; k<user.characters.length; k++) {
    var charToRemove = user.characters[k];
    if(arrayFromBnet.indexOf(charToRemove) < 0) {
      user.characters.splice(k, 1);
      needToMatch = true;
    }
  }
  user.needToMatch = needToMatch;
}


module.exports = userApiRouter;
