var request = require('request');
var express = require('express');
var wowProgressApiRouter = express.Router();

var url = "http://www.wowprogress.com/guild/eu/ysondre/Millenium/json_rank";


// Test route
wowProgressApiRouter.get('/', function(req, res) {
    request(url, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            res.send(body);
        } else {
            console.log(err);
        }
    });
});


module.exports = wowProgressApiRouter;
