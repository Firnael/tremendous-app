var express = require('express');
var characterApiRouter = express.Router();
// Model
var Character = require('../models/character');


// Get collection
characterApiRouter.route('/')
    .post(function(req, res) {
        var character = new Character();
        character.name = req.body.name;
        character.save(function(err) {
            if (err) { res.send(err); }
            res.json({ message: 'Character ' + character.name + ' created !' });
        });
    })

    .get(function(req, res) {
        Character.find(function(err, characters) {
            if (err) { res.send(err); }
            res.json(characters);
        });
    });

module.exports = characterApiRouter;
