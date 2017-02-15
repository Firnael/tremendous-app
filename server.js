// server.js
var express = require("express");
var session = require('express-session');
var fs = require('fs');
var https = require('https');
var mongoose = require('mongoose');
var path = require("path");
var bodyParser = require("body-parser");
var passport = require("passport");
var BnetStrategy = require('passport-bnet').Strategy;

// Routers
var characterApiRouter = require('./routes/characterApiRouter');
var guildApiRouter = require('./routes/guildApiRouter');
var rosterApiRouter = require('./routes/rosterApiRouter');
var progressApiRouter = require('./routes/progressApiRouter');
var rankingApiRouter = require('./routes/rankingApiRouter');
var bnetApiRouter = require('./routes/bnetApiRouter');
var warcraftLogsApiRouter = require('./routes/warcraftLogsApiRouter');
var wowTokenApiRouter = require('./routes/wowTokenApiRouter');

// Prepare options for HTTPS
var options = {
  cert: fs.readFileSync('ssl/cert.pem', 'utf8'),
  key: fs.readFileSync('ssl/key.pem', 'utf8')
};

// Secured routes middleware
var auth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
  } else {
    next();
  }
};

// User serializer
passport.serializeUser(function(user, done) {
  console.log("Serialize User : " + JSON.stringify(user));
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Use Bnet Strategy
passport.use(new BnetStrategy({
    clientID: 'w5s9afqgp8eq9y7q3crqdzmryq4qxadd',
    clientSecret: 'WSwhJMfBXemxA7ejPnWrG7yaEJVTUA8Z',
    callbackURL: "https://localhost:5443/auth/bnet/callback"
}, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    cookie : { maxAge: 86400000 },
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/ranking', auth, rankingApiRouter);

// External APIs
app.use('/api/bnet', bnetApiRouter);
app.use('/api/warcraftlogs', warcraftLogsApiRouter);
app.use('/api/wowtoken', wowTokenApiRouter);

// Bnet auth & callback
app.get('/auth/bnet', passport.authenticate('bnet'));
app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    }
);
// Authent check & logout
app.get('/authenticated', function(request, response) {
  response.send(request.isAuthenticated() ? request.user : undefined);
});
app.get('/logout', function(request, response) {
  console.log('Logging out');
  request.logOut();
  response.sendStatus(200);
});

var serverHttps = https.createServer(options, app).listen(5443, function () {
  console.log("Server HTTPS now running on port", serverHttps.address().port);
});

// Run server
// var server = app.listen(process.env.PORT || 8080, function () {
// 	console.log("Server now running on port", server.address().port);
// });
