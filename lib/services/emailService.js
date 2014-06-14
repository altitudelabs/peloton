'use strict';



var nodemailer = require('nodemailer');

/**
 * Logout
 */
exports.send = function (mailOptions) {

    // create reusable transport method (opens pool of SMTP connections)
    var transport = nodemailer.createTransport('SES', {
        AWSAccessKeyID: 'AKIAJ4KVPCRDTKKHY3TA',
        AWSSecretKey: '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'
    });



    // send mail with defined transport object
    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // shut down the connection pool, no more messages
    });
};