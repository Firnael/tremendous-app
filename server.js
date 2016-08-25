// server.js
var express = require("express");
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require("body-parser");

// Routers
var characterApiRouter = require('./routes/characterApiRouter');
var guildApiRouter = require('./routes/guildApiRouter');
var rosterApiRouter = require('./routes/rosterApiRouter');
var progressApiRouter = require('./routes/progressApiRouter');
var rankingApiRouter = require('./routes/rankingApiRouter');
var bnetApiRouter = require('./routes/bnetApiRouter');
var wowProgressApiRouter = require('./routes/wowProgressApiRouter');
var warcraftLogsApiRouter = require('./routes/warcraftLogsApiRouter');

// Connecting to MongoLab
mongoose.connect('mongodb://admin:admin@ds015934.mlab.com:15934/heroku_fgn342m5', function (err, res) {
    if (err) { console.log ('MONGOOSE ERROR, cannot connect to heroku_fgn342m5 : ' + err); }
    else { console.log ('App now connected to DB heroku_fgn342m5'); }
});

// Setting up Express server
var app = express();
app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

var router = express.Router();
router.use(function(req, res, next) {
	console.log('Routing : ' + req.method + ' ' + req.originalUrl);
	next();
});

// Local APIs
app.use('/api', router);
app.use('/api/character', characterApiRouter);
app.use('/api/guild', guildApiRouter);
app.use('/api/roster', rosterApiRouter);
app.use('/api/progress', progressApiRouter);
app.use('/api/ranking', rankingApiRouter);

// External APIs
app.use('/api/bnet', bnetApiRouter);
app.use('/api/wowprogress', wowProgressApiRouter);
app.use('/api/warcraftlogs', warcraftLogsApiRouter);

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});
