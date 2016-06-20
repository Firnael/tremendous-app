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
  console.log('Updating guild characters');

  Guild.findOne({ 'name': guildName }, function(errFindGuild, guild) {
      if (errFindGuild) { res.send(errFindGuild); }

      // Iterate over guild members and add / remove them
      async.each(guild.members, function (member, callback) {

          Character.findOne({ 'name': member.name }).exec(function (errFindChar, character) {
            if (errFindChar) { res.send(errFindChar); }
              // If character doesn't exist, create
              if(character == null) {
                  console.log('Character ' + member.name + ' does not exist, creating...');
                  var newCharacter = new Character();
                  newCharacter.name = member.name;
                  newCharacter.guildRank = member.rank;
                  newCharacter.save(function(errcreate) {
                      if (errcreate) { res.send(errcreate); }
                      console.log('Character ' + newCharacter.name + ' created !');
                  });
              }
          });
      },
      function (errorAsync) {
          return res.send({ message: 'GG' });
          // http://stackoverflow.com/questions/28478606/saving-items-in-mongoose-for-loop-with-schema-methods
      });

      // If exists in database but not in guild, remove
      /*
      var memberNames = [];
      for(var i=0; i<guild.members.length; i++) {
          memberNames.push(guild.members[i].name);
      }
      Character.find({ name: { $nin: memberNames } }).exec(function (err, characters) {
          if (err) { res.send(err); }
          for(var k=0; k<characters.length; k++) {
              var character = characters[k];
              console.log('Characted ' + character.name + ' no longer in guild, removed.');
              character.remove();
          }
      });
      */
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
