var express = require('express');
var bnet = require('battlenet-api')(process.env.BNET_STRATEGY_CLIENT_ID);
var guildApiRouter = express.Router();
// Model
var Guild = require('../models/guild');
// Data
var guildName = 'Wyrd';


/**
 * Get one
 */
guildApiRouter.route('/').get(function(req, res) {
    Guild.findOne({ 'name': guildName }, function(err, guild) {
        if (err) { res.send(err); }
        res.json(guild);
    });
});

/**
 * Create or update guild
 */
guildApiRouter.route('/update').post(function(req, res) {

  // Retrieve Bnet Api guild data
  bnet.wow.guild.members({ origin: 'eu', realm: 'ysondre', name: guildName }, function(err, data){
      if(err) {
        console.log(err);
        return res.send(err);
      }

      Guild.findOne({ 'name': guildName }, function(err, guild) {
          if (err) { res.send(err); }

          // If guild doesn't exist, create
          if(guild == null) {
            console.log('Guild does not exist, creating...');
            var newGuild = new Guild();
            newGuild = populateGuildObjectFromData(newGuild, data, false);
            newGuild.save(function(errcreate) {
                if (errcreate) { res.send(errcreate); }
                console.log('Guild ' + newGuild.name + ' created !');
                res.json({
                  message: 'Guild ' + newGuild.name + ' created !',
                  memberCount: newGuild.members.length,
                  lastModified: newGuild.lastModified
                });
            });
          }
          // If exists, update
          else {
            console.log('Guild exists, updating...');
            if(guild.lastModified == data.lastModified) {
              console.log('Guild ' + guild.name + ' is already up to date');
              res.json({
                message: 'Guild ' + guild.name + ' is already up to date',
                memberCount: guild.members.length,
                lastModified: guild.lastModified
              });
            }
            else {
              guild = populateGuildObjectFromData(guild, data, true);
              guild.save(function(errupdate) {
                  if (errupdate) { res.send(errupdate); }
                  console.log('Guild ' + guild.name + ' updated !');
                  res.json({
                    message: 'Guild ' + guild.name + ' updated !',
                    memberCount: guild.members.length,
                    lastModified: guild.lastModified
                  });
              });
            }
          }
      });

      function populateGuildObjectFromData(guildObject, data, update) {
        console.log(guildObject);
        console.log("===");
        console.log(data);

        if(!update) {
          guildObject.name = data.name;
        }
        guildObject.lastModified = data.lastModified;
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

  });
});

/**
 * Drop collection
 */
guildApiRouter.route('/drop').get(function(req, res) {
  Guild.remove({}, function(err) {
      console.log('Guild collection dropped')
  });
  res.send({ message: 'Guild collection dropped' });
});


module.exports = guildApiRouter;
