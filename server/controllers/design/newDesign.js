var Design = require('./../../models/design');
var Project = require('./../../models/project');
var _ = require('underscore');
var formidable = require('formidable');
var fs = require('fs');
var lwip = require('lwip');
var path = require('path');
var FileInfo = require('./../../helpers/FileInfo.js');

var opts = {
    uploadsDir: './../../../public/media/uploads',
    tmpDir: './../../../public/media/tmp',
    thumbnail : {
        width: 450
    }
};

var mkdirp = require('mkdirp');

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
        } else {

            var design = new Design();

            design.name = fields['name'];

            design.img.full = fileInfo.url;
            design.img.thumbnail = fileInfo.thumbnailUrl;

            design.owner = req.user._id;

            design.project = req.project._id;

            design.save(function(err){
                if(err) {
                    console.log(err);
                } else {

                    // insert new design into the project
                    Project.update({_id: req.project._id},
                        {$addToSet : { designs : design._id}},
                        function (err) {
                            if (err) {
                                return res.status(500);
                            } else {
                                return res.send(201);
                            }
                        }
                    );

                    // get project and add to design
                }
            });
        }

    });

    form.parse(req);
};
