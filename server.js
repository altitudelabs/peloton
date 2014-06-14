'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

/**
 *  Local Middleware
 */
var middleware = require('./lib/middleware');

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

// Passport Configuration
var passport = require('./lib/config/passport');

var app = express();

/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');
var hbs;

// For gzip compression
app.use(express.compress());

//get the config into the request so it can be accessed in controllers...
//this seems very brittle...
app.use(function (req, res, next) {
    req.config = config;
    return next();
});


// Express settings

require('./lib/config/express')(app);

// API Routing
require('./lib/api_routes')(app);

// App routes
require('./lib/app_routes')(app);


// Populate empty DB with sample data
if(app.settings.env==="local"){
    require('./lib/config/dummydata');
}


// Start server
app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});


exports = module.exports = app;