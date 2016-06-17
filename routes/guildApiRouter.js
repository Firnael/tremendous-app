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
          newGuild.lastModified = req.body.lastModified;
          newGuild.name = guildName;
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
            guild.lastModified = req.body.lastModified;
            guild.save(function(errupdate) {
                if (errupdate) { res.send(errupdate); }
                console.log('Guild ' + guild.name + ' updated !');
                res.send({ message: 'Guild ' + guild.name + ' updated !' });
            });
          }
        }
    });
});

// Drop collection
guildApiRouter.route('/drop').get(function(req, res) {
  Guild.remove({}, function(err) {
      console.log('Guild collection dropped')
  });
  res.send({ message: 'Guild collection dropped' });
});

module.exports = guildApiRouter;
