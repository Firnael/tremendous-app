// server.js
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

var bnetApiRouter = require('./routes/bnetApiRouter');
var wowProgressApiRouter = require('./routes/wowProgressApiRouter');
var warcraftLogsApiRouter = require('./routes/warcraftLogsApiRouter');


var app = express();
app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

var router = express.Router();
router.use(function(req, res, next) {
	console.log('smth is happening');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'Qu\'est ce que tu fais là :) ?' });
});

app.use('/api', router);
app.use('/api/bnet', bnetApiRouter);
app.use('/api/wowprogress', wowProgressApiRouter);
app.use('/api/warcraftlogs', warcraftLogsApiRouter);

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});
