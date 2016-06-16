// server.js
var express = require("express");
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require("body-parser");

// Routers
var characterApiRouter = require('./routes/characterApiRouter');
var bnetApiRouter = require('./routes/bnetApiRouter');
var wowProgressApiRouter = require('./routes/wowProgressApiRouter');
var warcraftLogsApiRouter = require('./routes/warcraftLogsApiRouter');

// Connecting to MongoLab
mongoose.connect('mongodb://admin:admin@ds015934.mlab.com:15934/heroku_fgn342m5', function (err, res) {
    if (err) { console.log ('MONGOOSE ERROR, cannot connect to heroku_fgn342m5 : ' + err); }
    else { console.log ('MONGOOSE SUCCESS, Connected to heroku_fgn342m5 !'); }
});

// Setting up Express server
var app = express();
app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var router = express.Router();
router.use(function(req, res, next) {
	console.log('Routing...');
	next();
});

// Local APIs
app.use('/api', router)
app.use('/api/character', characterApiRouter);

// External APIs
app.use('/api/bnet', bnetApiRouter);
app.use('/api/wowprogress', wowProgressApiRouter);
app.use('/api/warcraftlogs', warcraftLogsApiRouter);

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});
