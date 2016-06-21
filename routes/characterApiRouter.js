var express = require('express');
var async = require('async');
var bnet = require('battlenet-api')('tpkmytrfpdp2casqurxt24z8ub5u4khn');
var characterApiRouter = express.Router();
// Models
var Character = require('../models/character');
var Guild = require('../models/guild');
// Data
var guildName = 'Millenium';


// TODO REMOVE
characterApiRouter.route('/createcroc').get(function(req, res) {
    var character = new Character();
    character.name = 'Croclardon';
    character.save(function(err) {
        if (err) { res.send(err); }
        res.json({ message: 'Character ' + character.name + ' created !' });
    });
})

// TODO REMOVE
characterApiRouter.route('/createhyrm').get(function(req, res) {
    var character = new Character();
    character.name = 'Hyrm';
    character.save(function(err) {
        if (err) { res.send(err); }
        res.json({ message: 'Character ' + character.name + ' created !' });
    });
})

// Get collection
characterApiRouter.route('/').get(function(req, res) {
    Character.find(function(err, characters) {
        if (err) { res.send(err); }
        res.json(characters);
    });
});

// Create or update guild characters
characterApiRouter.route('/update').post(function(req, res) {
  console.log('Updating guild characters...');

  var addedCharacters = [];
  var removedCharacters = [];
  function overrideCallback(added, characterName, asyncCallback) {
      if(characterName) {
          added ? addedCharacters.push(characterName) : removedCharacters.push(characterName);
      }
      asyncCallback();
  }

  Guild.findOne({ 'name': guildName }, function(errFindGuild, guild) {
      if (errFindGuild) { res.send(errFindGuild); }

      // Iterate over guild members and add / remove them
      async.each(guild.members, function (member, asyncAddCallback) {

          Character.findOne({ 'name': member.name }).exec(function (errFindChar, character) {
            if (errFindChar) { res.send(errFindChar); }

              // If character doesn't exist, create
              if(character == null) {
                  var newCharacter = new Character();
                  newCharacter.name = member.name;
                  newCharacter.guildRank = member.rank;
                  newCharacter.save(function(errcreate) {
                      if (errcreate) { res.send(errcreate); }
                      overrideCallback(true, member.name, asyncAddCallback);
                  });
              } else {
                overrideCallback(null, null, asyncAddCallback);
              }
          });
      },
      function (errAddAsync) {
          if(errAddAsync) { res.send(errAddAsync); }
          console.log('Characters added.');
          removeKickedCharacters();
      });

      function removeKickedCharacters() {
        // If exists in database but not in guild, remove
        var memberNames = [];
        for(var i=0; i<guild.members.length; i++) {
            memberNames.push(guild.members[i].name);
        }

        Character.find({ name: { $nin: memberNames } }).exec(function (err, characters) {
            if (err) { res.send(err); }

            async.each(characters, function (characterToRemove, asyncRemoveCallback) {
                characterToRemove.remove();
                overrideCallback(false, characterToRemove.name, asyncRemoveCallback);
            },
            function(errRemoveAsync) {
                if(errRemoveAsync) { res.send(errRemoveAsync); }
                console.log('Characters removed.');
                jobDone();
            });
        });
      }

      function jobDone() {
        console.log('Results: ' + addedCharacters.length + ' added, ' + removedCharacters.length + ' removed.');
        return res.send({
          message: 'Characters updated',
          addedCharacters: addedCharacters,
          removedCharacters: removedCharacters
        });
      }
  });
});

// Drop collection
characterApiRouter.route('/drop').get(function(req, res) {
  Character.remove({}, function(err) {
      console.log('Character collection dropped')
  });
  res.send({ message: 'Character collection dropped' });
});

module.exports = characterApiRouter;
