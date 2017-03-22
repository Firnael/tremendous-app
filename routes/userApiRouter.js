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
 * Get users
 */
userApiRouter.get('/all', function(req, res) {
  User.find({}, function (err, users) {
    if (err) { return res.send(err); }
    return res.send(users);
  });
});


/**
 * Get by battletag
 */
userApiRouter.get('/battletag/:battletag', function(req, res) {
  User.findOne({ 'battletag': req.params.battletag }, function (err, user) {
    if (err) { return res.send(err); }
    return res.send(user);
  });
});


/**
 * Update user thumbnail
 */
userApiRouter.post('/thumbnail', function(req, res) {
  var data = req.body;
  User.findOne({ 'battletag': data.battletag }, function (err, user) {
    if (err) { return res.send(err); }
    user.thumbnail = data.thumbnail;
    user.lastUpdate = Date.now();
    // Save user
    user.save(function(errsave) {
      if (errsave) { return res.send(errsave); }
      console.log('User ' + user.battletag + ' thumbnail updated');
      return res.send(user);
    });
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
      user.characters = [];
      user.needToMatch = true;
      user.thumbnail = '';
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
        return res.send(user);
      });
    });
  });
});

function matchUserWithCharacters(user) {
  async.each(user.characters, function (characterName, asyncCallback) {
    Character.findOne({ 'name': characterName }, function(errFindChar, character) {
      if (errFindChar) { console.log(errFindChar); return; }
      if (character) {
        character.battletag = user.battletag;
        character.accountIdentifier = -1;
        character.lastModified = Date.now();
        character.save(function(errSaveChar) {
          if (errSaveChar) { console.log(errSaveChar); return; }
          console.log('Character ' + character.name + ' matched with the account ' + user.battletag);
          asyncCallback();
        });
      }
    });
  },
  function (errAsync) {
    if(errAsync) { console.log(errAsync); return; }
    console.log('Match done');
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
