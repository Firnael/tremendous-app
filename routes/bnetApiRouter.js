var express = require('express');
var bnet = require('battlenet-api')('tpkmytrfpdp2casqurxt24z8ub5u4khn');
var bnetApiRouter = express.Router();
var guildName = 'Millenium';


// Test route
bnetApiRouter.get('/', function(request, response) {
    bnet.wow.data.battlegroups({ origin: 'eu' }, function(err, body, res) {
        if(!err) {
            response.send(body);
        } else {
            console.log(err);
        }
    });
});

// Get character info
bnetApiRouter.get('/character/:characterName', function(request, response) {
    bnet.wow.character.profile({ origin: 'eu', realm: 'ysondre', name: request.params.characterName }, function(err, body, res) {
        if(!err) {
            response.send(body);
        } else {
            console.log(err);
        }
    });
});

// Get guild members
bnetApiRouter.get('/guild/members', function(request, response) {
    bnet.wow.guild.members({ origin: 'eu', realm: 'ysondre', name: guildName }, function(err, body, res){
        if(!err) {
            response.send(body);
        } else {
            console.log(err);
        }
    });
});

// Get guild news
bnetApiRouter.get('/guild/news', function(request, response) {
    bnet.wow.guild.news({ origin: 'eu', realm: 'ysondre', name: guildName }, function(err, body, res){
        if(!err) {
            response.send(body);
        } else {
            console.log(err);
        }
    });
});

module.exports = bnetApiRouter;
