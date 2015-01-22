var Design = require('./../../models/design');
var Project = require('./../../models/project');
var FileInfo = require('./../../helpers/FileInfo.js');
var fileUpload = require('./../../helpers/fileUpload.js');

var _ = require('underscore');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');

var opts = {
    uploadsDir: './../../../public/media/uploads',
    tmpDir: './../../../public/media/tmp',
    thumbnail : {
        width: 450,
        height: 257
    }
};

/**
 * @api {post} /api/projects/:projectid/designs Add design to specific project
 *
 * @apiName Add new design
 * @apiGroup Designs
 *
 * @apiParam {String} name Design name
 * @apiParam {File} file Design image
 *
 * @apiPermission User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiUse InvalidData
 *
 * @apiUse ProjectNotFound
 *
 * @apiUse NotAuthorized
 */
module.exports =  function newDesignCtrl (req, res, next) {

    var form = new formidable.IncomingForm();

    // store all the files info in an object
    var fileInfo = null;

    var errors = [], // errors
        fields = {};

    // only allow one file to be uploaded
    var fileCount = 1;

    var projectDir = '';   // expose projectDir

    // set ulpoads file
    form.uploadDir = path.resolve(__dirname + opts.tmpDir);

    form.on('fileBegin', function(name, file) {

        projectDir = path.resolve(__dirname + opts.uploadsDir  + '/' +  req.project._id + '/');

        // check if project and thumbnail directory
        // exists and create them if not
        _.each([projectDir, projectDir + '/thumbnails'], function (dir) {
            mkdirp.sync(dir);
        });
    });

    form.on('file', function (name, file) {

        fileInfo = new FileInfo(file, {
            project: req.project._id
        });

        fileInfo.init();

        // timestamp the image
        fileInfo.safeName();

        // validate the image
        var validObj = fileInfo.validate();

        // if not valid push error
        // else upload and create thumbnail
        if (!validObj.valid) {
            errors.push(validObj.msg);
        } else {
            // move image from tmp dir to uplaods dir
            fileUpload.upload(fileInfo, function(err){
                if(err) {
                    console.log(err);
                    errors.push(err);
                } else {
                    fileCount--;
                    finish();
                }
            });
        }

    });

    form.on('field', function(name, value) {

        // store form fields in an object
        fields[name] = value;

    });

    form.on('end', function () {
        finish();
    });

    form.parse(req);

    // if all files are downloaded and thumbnials created then save to db
    function finish() {

        // any errors send them to the user
        if (errors.length) {
            return next({
                message: errors[0],
                status: 400
            });
        }

        if (!fileInfo) {
            return next({
                message: 'no file attached',
                status: 404
            });
        }

        if (!fileCount) {

            async.waterfall([
                // save design
                function (cb) {
                    // generate URL's
                    fileInfo.urls(req);

                    // set up new design and set values on it
                    var design = new Design();
                    design.name = fileInfo.designName || fileInfo.name;
                    design.img.full = fileInfo.url;
                    design.img.thumbnail = fileInfo.thumbnailUrl;
                    design.owner = req.user._id;
                    design.project = req.project._id;

                    design.save(function(err){

                        if (err) {
                            return cb(err);
                        }

                        cb(null, design);

                    });

                },
                // save refernece of design in project
                function (design, cb) {
                    Project
                    .findOne({_id: req.project._id})
                    .exec(function (err, project) {
                        if(err) {
                            return cb(err);
                        }

                        if(!project) {
                            return cb({
                                message: 'no project found',
                                status: 404
                            });
                        }

                        // set thumbnail if the
                        // design is the projects first
                        if(!project.designs.length) {
                            project.thumbnail = design.img.thumbnail
                        }

                        // add design to project
                        project.designs.push(design._id);

                        project.designCount = project.designs.length;

                        // add to recent activites of project
                        project.recentActivities.push({
                            activityType: 'new design',
                            completedBy: req.user._id,
                            design: design._id
                        });

                        project.save(function(err) {
                            if(err) {
                                return cb(err);
                            }

                            cb(null);
                        });

                    });
                }
                ],
                // handle response
                function(err) {
                if (err) {
                    return next(err);
                }

                res.sendStatus(201);
            });

        }
    }
};
