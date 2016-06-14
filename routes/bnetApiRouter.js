var express = require('express');
var bnet = require('battlenet-api')('tpkmytrfpdp2casqurxt24z8ub5u4khn');
var bnetApiRouter = express.Router();


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
    console.log('yay');
    bnet.wow.guild.members({ origin: 'eu', realm: 'ysondre', name: 'fesseroll' }, function(err, body, res){
        if(!err) {
            response.send(body);
        } else {
            console.log(err);
        }
    });
});


module.exports = bnetApiRouter;
