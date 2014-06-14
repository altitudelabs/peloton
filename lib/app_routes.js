//
// App-specific routes
//

'use strict';

var assets = require("./services/assetService");
var middleware = require('./middleware');



module.exports = function(app) {

    //
    // Logout
    //
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //
    // Home
    //
    app.get("/", function(req, res) {
        res.render('app', {layout: 'app'});
    })

}