var Design = require('./../../models/design');
var Project = require('./../../models/project');
var _ = require('underscore');
var formidable = require('formidable');
var fs = require('fs');
var lwip = require('lwip');
var path = require('path');
var FileInfo = require('./../../helpers/FileInfo.js');
var mkdirp = require('mkdirp');

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
            fs.rename(file.path, projectDir + '/' + fileInfo.name, function (err) {
                if(err) {
                    console.log(err);
                    errors.push(err);
                }
                // create thumbnail of image
                lwip.open(projectDir + '/' + fileInfo.name, function (err, image) {

                    if (image) {
                        image.batch()
                        .resize(opts.thumbnail.width, fileInfo.dimensions.height / fileInfo.dimensions.width * opts.thumbnail.width)
                        .crop(0, 0, opts.thumbnail.width, opts.thumbnail.height)
                        .writeFile(projectDir + '/thumbnails/' + fileInfo.name , function (err){
                            if(err) {
                                console.log(err);
                                errors.push(err);
                            }
                        });
                    }
                });

            });
        }

    });

    form.on('field', function(name, value) {

        // store form fields in an object
        fields[name] = value;

    });

    form.on('end', function () {

        // generate urls for images
        if(fileInfo) {
            fileInfo.urls(req);
        }

        // any errors send them to the user
        if (errors.length) {
            return res.status(400).send(errors[0]);
        } else if (!fileInfo) {
            return res.status(404).send('no file attached to form');
        } else {

            var design = new Design();

            design.name = fileInfo.designName || fileInfo.name;

            design.img.full = fileInfo.url;
            design.img.thumbnail = fileInfo.thumbnailUrl;

            design.owner = req.user._id;

            design.project = req.project._id;

            design.save(function(err){
                if(err) {
                    console.log(err);
                } else {

                    Project.findOne({_id: req.project._id}, function (err, project) {
                        if(err) {
                            console.log(err);
                        }

                        if(!project) {
                            return res.status(400).send('no project found');
                        } else {

                            // set thumbnail if the
                            // design is the projects first
                            if(!project.designs.length) {
                                project.thumbnail = design.img.thumbnail
                            }

                            // add design to project
                            project.designs.push(design._id);

                            project.designCount = project.designs.length;

                            project.save(function(err) {
                                if(err) {
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(201);
                                }
                            });
                        }
                    });

                    // get project and add to design
                }
            });
        }

    });

    form.parse(req);
};
