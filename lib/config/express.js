'use strict';

var express = require('express');
var path = require('path');
var config = require('./config');
var passport = require('passport');
var mongoStore = require('connect-mongo')(express);
var exphbs = require('express3-handlebars');
var middleware = require('../middleware');


/**
 * Express configuration
 */
module.exports = function(app) {

  /**
  *  Local dev workspace config...
  */
  app.configure('local', function(){

      console.log("configuring local express stuffs");
      app.use(express.favicon(path.join(config.root, 'app', 'favicon.ico')));

      app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'app',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    app.use(express.static(path.join(config.root, 'app')));

      app.use('/partials' ,function (req, res) {
          return middleware.angularPartials(req,res,
              path.join(config.root, 'app/views/partials'))});


  });

    /**
     * Development (Server Based Config)
     */
    app.configure('stage', function(){

        console.log("configuring development express stuffs");
        app.use(express.favicon(path.join(config.root, 'dist/assets', 'favicon.ico')));

        // Locate the assets
        var staticPath =  path.join(config.root, 'dist/assets');
        app.use(express.static(staticPath));

        app.use('/partials' ,function (req, res) {
            return middleware.angularPartials(req,res,
                path.join(config.root, 'dist/assets/views/partials'))});

        // Set the default layout and locate layouts and partials
        app.engine('handlebars', exphbs({
            defaultLayout: 'app',
            layoutsDir: 'dist/views/layouts/',
            partialsDir: 'dist/views/partials/'
        }));

    });

    /**
     * Development (Server Based Config)
     */
    app.configure('development', function(){

        console.log("configuring development express stuffs");
        app.use(express.favicon(path.join(config.root, 'dist/assets', 'favicon.ico')));

        // Locate the assets
        var staticPath =  path.join(config.root, 'dist/assets');
        app.use(express.static(staticPath));

        app.use('/partials' ,function (req, res) {
            return middleware.angularPartials(req,res,
                path.join(config.root, 'dist/assets/views/partials'))});

        // Set the default layout and locate layouts and partials
        app.engine('handlebars', exphbs({
            defaultLayout: 'app',
            layoutsDir: 'dist/views/layouts/',
            partialsDir: 'dist/views/partials/'
        }));

    });
/**
 * Config for all environments...
 */
  app.configure(function(){

    console.log("configuring common express stuffs");

    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    // Persist sessions with mongoStore
    app.use(express.session({
      secret: 'love and rockets',
      store: new mongoStore({
        url: config.mongo.uri,
        collection: 'sessions'
      }, function () {
          console.log("db connection open");
      })
    }));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(request, response, next) {
        console.log("Request is authenticated:"+request.isAuthenticated() );
        response.locals.userAuthenticated = request.isAuthenticated();
        next();
     });

    app.set('view engine', 'handlebars');


      // Set a cookie for Angular so it knows we have an HTTP session
   // app.use(middleware.setUserCookie);

      // Router (only error handlers should come after this)
    app.use(app.router);

    app.use(function (req, res, next) {

            if(req.url.indexOf('.') > -1){
                //any assets (containts a '.') are not found
                res.status(404);
                res.send(404);
            }else{
                //any paths go back to angular and it can see if it has a path.
                res.render('app', {layout: 'app'});
            }
    });


    app.use(function(err, req, res, next) {

        console.error(err.stack);

        var errorStatus = err.status || 500;


        // Handle XHR requests - return error status.
        // Check if "Accept" header specifies application/json
        if ( /application\/json/.test(req.get("accept")) ) {
            res.status(errorStatus);
            res.json(errorStatus);
        }
        // Handle regular requests - render error template
        else {
            res.render(errorStatus);
        }

    });

  });

};