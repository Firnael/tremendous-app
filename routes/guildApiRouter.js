var express = require('express');
var guildApiRouter = express.Router();
// Model
var Guild = require('../models/guild');
var guildName = 'Millenium';


// Get collection
guildApiRouter.route('/').get(function(req, res) {
    Guild.find({ 'name': guildName }, function(err, guild) {
        if (err) { res.send(err); }
        res.json(guild);
    });
});

// Create or update guild
guildApiRouter.route('/update').post(function(req, res) {

    // console.log(req.body);
    Guild.findOne({ 'name': guildName }, function(err, guild) {
        if (err) { res.send(err); }

        // If guild doesn't exist, create
        if(guild == null) {
          console.log('Guild does not exist, creating...');
          var newGuild = new Guild();
          newGuild = populateGuildObjectFromData(newGuild, req.body);
          newGuild.save(function(errsave) {
              if (errsave) { res.send(errsave); }
              console.log('Guild ' + newGuild.name + ' created !');
              res.send({ message: 'Guild ' + newGuild.name + ' created !' });
          });
        }
        // If exists, update
        else {
          console.log('Guild exists, updating...');
          if(guild.lastModified == req.body.lastModified) {
            console.log('Guild ' + guild.name + ' is already up to date');
            res.send({ message: 'Guild ' + guild.name + ' is already up to date' });
          }
          else {
            guild = updateGuildObjectFromData(guild, req.body);
            guild.save(function(errupdate) {
                if (errupdate) { res.send(errupdate); }
                console.log('Guild ' + guild.name + ' updated !');
                res.send({ message: 'Guild ' + guild.name + ' updated !' });
            });
          }
        }
    });

    function populateGuildObjectFromData(guildObject, data) {
      guildObject.lastModified = data.lastModified;
      guildObject.name = data.name;
      guildObject.level = data.level;
      guildObject.achievementPoints = data.achievementPoints;
      guildObject.members = [];
      for(var i=0; i<data.members.length; i++) {
        var member = {};
        member.name = data.members[i].character.name;
        member.rank = data.members[i].rank;
        guildObject.members.push(member);
      }
      return guildObject;
    }

    function updateGuildObjectFromData(guildObject, data) {
      guildObject.lastModified = data.lastModified;
      guildObject.level = data.level;
      guildObject.achievementPoints = data.achievementPoints;

      // if(guildObject.members.length != data.members.character.length) {
      //
      // }
      return guildObject;
    }
});

// Drop collection
guildApiRouter.route('/drop').get(function(req, res) {
  Guild.remove({}, function(err) {
      console.log('Guild collection dropped')
  });
  res.send({ message: 'Guild collection dropped' });
});

module.exports = guildApiRouter;
