//
// Contact Controller
// - Server-side
// - Responsible for email information posted from contact form
//

'use strict';

var mongoose = require("mongoose"),
    emailService = require('../services/emailService');

//
// Email information posted from contact form
//
exports.send = function(req, res) {

    var body = req.body;

    var bodyContentParts = ["A new message has been submitted on Peloton Street.\r\n\r\nName:",
        body.name,
        "\r\nEmail:",
        body.email,
        "\r\nMessage:",
        body.message];

    var bodyContent = bodyContentParts.join(" ");

    var mailOptions = {
        from: "Peloton Street <test@clevercanary.com>",
        to: "mim@clevercanary.com, ",
        subject: "Peloton Street - New Message",
        text: bodyContent
    };

    emailService.send(mailOptions);

    return res.send(200);
};

//
// Email information posted from sponsor splash page (get funded) contact form
//
exports.sendSponsorContact = function(req, res) {

    var body = req.body;

    var bodyContentParts = ["A new sponsor contact has been submitted on Peloton Street.\r\n\r\nName:",
        body.name,
        "\r\Company:",
        body.company,
        "\r\Phone:",
        body.phone,
        "\r\nEmail:",
        body.email,
        "\r\nMessage:",
        body.message];

    var bodyContent = bodyContentParts.join(" ");

    var mailOptions = {
        from: "Peloton Street <test@clevercanary.com>",
        to: "mim@clevercanary.com, ",
        subject: "Peloton Street - New Sponsor Contact",
        text: bodyContent
    };

    emailService.send(mailOptions);

    return res.send(200);
};