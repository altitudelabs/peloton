//
// API-specific routes
//

'use strict';

var index = require('./controllers');
var users = require('./controllers/users');
var sponsors = require("./controllers/sponsors");
var deals = require("./controllers/deals");
var investments = require("./controllers/investments");
var people = require("./controllers/people");
var properties = require("./controllers/properties");
var session = require('./controllers/session');
var assets = require('./services/assetService');
var contact = require('./controllers/contact');

var middleware = require('./middleware');

/**
 * Application routes
 */

module.exports = function(app) {

    // User
    app.post('/api/users', users.create);
//    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);
    app.post('/api/users/:id/deactivate', middleware.requireRole("admin"), users.deactivate);
    app.post('/api/users/:id/reactivate', middleware.requireRole("admin"), users.reactivate);
    app.get("/api/users", middleware.requireRole("admin"), users.index);

    // Password
    app.post("/api/users/password/request-reset", users.requestResetPassword);
    app.post("/api/users/password/reset", users.resetPassword);

    // Account
    app.post("/api/signup/activate", users.activateAccount);

    // Session
    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    // Sponsor
    // - List allowed by users only
    // - Create and delete only allowed by admin users
    app.get("/api/sponsors", sponsors.index);
    app.get("/api/sponsors/:id", middleware.auth, sponsors.findById);
    app.post('/api/sponsors', middleware.requireRole("admin"), sponsors.create);
    app.put("/api/sponsors/:id", middleware.requireRole("admin"), sponsors.update);
    app.delete('/api/sponsors/:id', middleware.requireRole("admin"), sponsors.delete);
    app.post('/api/sponsors/:id/heroImage', middleware.requireRole("admin"), sponsors.updateHeroImage);
    app.post('/api/sponsors/:id/logoImage', middleware.requireRole("admin"), sponsors.updateLogoImage);

    // People (team members)
    app.get("/api/sponsors/:sponsorId/people", middleware.auth, people.findBySponsorId);
    app.post("/api/sponsors/:sponsorId/people", middleware.auth, people.create);
    app.put("/api/sponsors/:sponsorId/people/:id", middleware.auth, people.update);
    app.delete("/api/sponsors/:sponsorId/people/:id", middleware.auth, people.delete);
    app.post('/api/sponsors/:id/people/:id/profilePicture', middleware.requireRole("admin"), people.updateProfilePicture);

    // Properties (featured properties)
    app.get("/api/sponsors/:sponsorId/properties", middleware.auth, properties.findBySponsorId);
    app.post("/api/sponsors/:sponsorId/properties", middleware.auth, properties.create);
    app.put("/api/sponsors/:sponsorId/properties/:id", middleware.auth, properties.update);
    app.delete("/api/sponsors/:sponsorId/properties/:id", middleware.auth, properties.delete);
    app.post('/api/sponsors/:id/properties/:id/heroImage', middleware.requireRole("admin"), properties.updateHeroImage);

    // Deals
    app.get("/api/deals", middleware.auth, deals.index);
    app.get("/api/deals/:id", middleware.auth, deals.findById);
    app.post("/api/deals/:id/invest", middleware.auth, investments.create);
    app.post("/api/deals/:id/", middleware.auth, investments.create);
    app.get("/api/deals/:id/investors/me", middleware.auth, investments.isInvestor);

    // Investments
    app.get("/api/users/:userId/investments", middleware.isAdminOrOwner, investments.findByUserId);

    // Contact form
    app.post("/api/contact", contact.send);
    app.post("/api/sponsors/get-funded-contact", contact.sendSponsorContact);

    // Assets DB
    app.get('/db-assets/:fileName', assets.read);

    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
//    app.get('/partials/*', function(req, res) {
//        res.send(404);
//    });

};