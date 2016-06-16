var express = require('express');
var characterApiRouter = express.Router();

// Model
var Character = require('../models/character');


characterApiRouter.route('/character')
    .post(function(req, res) {
        console.log('POST /api/character');

        var character = new Character();
        character.name = req.body.name;
        character.save(function(err) {
            if (err) { res.send(err); }
            res.json({ message: 'Character ' + character.name + ' created !' });
        });
    })

    .get(function(req, res) {
        console.log('GET /api/character');

        Character.find(function(err, characters) {
            if (err) { res.send(err); }
            res.json(characters);
        });
    });

module.exports = characterApiRouter;
