'use strict';

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var multiparty = require('multiparty');

/**
 * Create a Single Asset
 *
 * Returns an error if multiple files are sent.
 * Expects to associate that asset with...
 */
exports.create = function (req, res, callback) {

    var grid = new Grid(mongoose.connection.db, mongoose.mongo);

    /**
     * Setup state variables for this action.
     */

    var fileProcessed = false;             //true if we have processed a file.
    var fields = {};                       //holder for form fields
    var form = new multiparty.Form();      //the form
    var id;                                //id of the to be created document
    var fileExtension;

    /**
     * part: Handle part which is a ReadableStream. Called for all parts
     * but we will skip if the part is not a file.
     */
    form.on('part', function (part) {

        // Check if this part is a file and skip if
        // it is not
        if (!part.filename) {
            return; //LOL
        }

        if (fileProcessed) {
            throw 'Attempt to send multiple files to AssetService.create';   //only process one file
        }
        else {
            fileProcessed = true;
        }

        // Determine the file extension
        fileExtension = part.filename.split('.').pop();
        if (fileExtension === part.filename) {
            throw 'Error attempting to parse file extension for file name: ' + part.filename;
        }

        var mongoOpts = {
            //no id as this is a create
            filename: part.filename,
            mode: 'w', //write
            root: 'assets'
        };

        var ws = grid.createWriteStream(mongoOpts);

        ws.on('close',  function () {
            callback(null, {
                id: id,
                fileExtension: fileExtension
            });
        });

        ws.on('error', function (err) {
            callback(err);
        });

        id = ws.id;

        part.pipe(ws);

    });

    /**
     * Called for each firm field, not for files.
     */
    form.on('field', function (name, value) {
        fields[name] = value;
    });

    /**
     * error: called on error. Must be handled to avoid "server crash" says dox.
     */
    form.on('error', function (err) {
        callback(err);
    });

    /**
     * parse! All setup is done lets parse this request.
     */
    form.parse(req);

};


/**
 * Read Asset
 */
exports.read = function (req, res) {

    //TODO is there a better way to do this?
    var fileName = req.param('fileName');

    // Make sure there's a file name Dave!
    if (!fileName) {
        res.json(500, 'No fileName specified');
        return;
    }

    // Determine ID from file name
    var chunks = fileName.split('.');
    if (chunks.length !== 2) {
        res.send(500, 'Error attempting to parse ID from file name: ' + fileName);
        return;
    }
    var id = chunks[0];

     // Make sure we have an ID
     // TODO is the re a better way to test this?
    if (!id) {
        res.send(500, 'No ID specified');
        return;
    }

    /**
     * Setup to read by the ID
     */
    var grid = new Grid(mongoose.connection.db, mongoose.mongo);
    var rs = grid.createReadStream({
        _id: id,
        mode: 'r', //read
        root: 'assets'
    });

    /**
     * Register error function in case we cant find it.
     * (or other error)
     */
    rs.on('error', function (err) {
        console.log('read error:' + err);
        res.send(404);
        return;
    });

    //TODO Content Type
    //TODO download instead of display in line (content disposition)
    rs.pipe(res);

};
