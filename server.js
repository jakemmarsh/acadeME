'use strict';

var express        = require('express');
var morgan         = require('morgan');
var compression    = require('compression');
var methodOverride = require('method-override');
var bodyParser     = require('body-parser');
var busboy         = require('connect-busboy');
var session        = require('express-session');
var passport       = require('passport');
var models         = require('./api/models');
var api            = require('./api');
var app            = express();
var server         = app.listen(process.env.PORT || 3000);
var populateDb     = require('./populateDb');
var config         = require('./config');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

/* ====================================================== */

app.use(morgan('dev'));     // Logs all requests to the console
app.use(compression());     // Compresses response data with gzip/deflate
app.use(methodOverride());  // Simulates DELETE and PUT
app.use(bodyParser.json()); // Parses req.body json from html POST
app.use(bodyParser.urlencoded({
    extended: true
}));                        // Parses urlencoded req.body, including extended syntax
app.use(busboy());          // Parse multipart/form-data
app.set('json spaces', 0);  // Remove superfluous spaces from JSON responses
app.use(session({
  secret: config.secret,
  cookie: {
    maxAge: 1000*60*30 // only 30 minutes until user logs in
  },
  store: new SequelizeStore({ db: models.sequelize }),
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/* ====================================================== */

// Connect to database and initialize models
if ( process.env.NODE_ENV === 'production' ) {
  models.sequelize.sync();
} else {
  models.sequelize.sync({ force: true }).done(function() {
    populateDb(models);
  });
}

/* ====================================================== */

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

/* ====================================================== */

// serve all asset files from necessary directories
// TODO: find a way to get rid of these wildcards?
app.use('*/js', express.static(__dirname + '/build/js'));
app.use('*/images', express.static(__dirname + '/build/images'));
app.use('*/css', express.static(__dirname + '/build/css'));
app.use('*/fonts', express.static(__dirname + '/build/fonts'));

// Mount the API
app.use('/api', api(server));

// Serve index.html for all main routes to leave routing up to react-router
app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build' });
});