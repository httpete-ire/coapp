var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var _ = require('underscore');
var lwip = require('lwip');
var async = require('async');

var opts = {
    uploadsDir: './../../public/media/uploads',
    tmpDir: './../../../public/media/tmp',
    thumbnail : {
        width: 450,
        height: 257
    }
};

/**
 * check if the directories exist and if false create them
 *
 * @param  {String} path of directory to check for
 *
 */
function exists (dir) {
    'use strict';

    // check if path exists
    fs.exists(path.resolve(dir), function (exists) {
        if (!exists) {
            mkdirp.sync(path.resolve(dir), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(path.resolve(dir) + ' directory was created');
                }
            });
        }
    });
}

/**
 * Check if upload directory exists
 *
 * @param  {String} dir :: directory to check for
 */
function checkExists (dir) {
    'use strict';
    if(_.isArray(dir)) {
        _.each(dir, function (d){
            exists(d);
        });
    } else {
        exists (dir);
    }
}

/**
 * upload an image and generate a thumbnail, calls the cb
 * function when complete
 *
 * @param  {Object}   fileInfo
 * @param  {Function} callback function to call when complete
 *
 */
function upload (fileInfo, cb) {

    // move image to upload directory
    fs.rename(fileInfo.path, fileInfo.uploadDir + '/' + fileInfo.name,
        function(err) {

            if(err) {
                cb(err);
            }

            // generate thumbnails
            lwip.open(fileInfo.uploadDir + '/' + fileInfo.name, function (err, image) {

                // calculate the aspect ratio of the image
                var aspectRatio = fileInfo.dimensions.height / fileInfo.dimensions.width * opts.thumbnail.width;

                if (image) {
                    image.batch()
                    .resize(opts.thumbnail.width, aspectRatio)
                    .crop(0, 0, opts.thumbnail.width, opts.thumbnail.height)
                    .writeFile(fileInfo.uploadDir + '/thumbnails/' + fileInfo.name , function (err){

                        if(err) {
                            cb(err);
                        } else {
                            // complete so we can call the callback function
                            cb();
                        }

                    });
                }

            });

        });

}

/**
 * remove images from system
 *
 * @param  {Array}   images              :: array of image paths
 * @param  {Mongo Object ID}   projectId :: ID of project
 * @param  {Function} cb                 :: callback to execute
 */
function removeImgs (images, projectId, cb) {

    var uploadDir = path.resolve(__dirname + opts.uploadsDir + '/');

    async.each(images, function (img, cb) {
        // get the name of the image
        var imgPath = img.indexOf(projectId.toString());
        img = img.substring(imgPath, img.length);

        // remove the image
        fs.unlink(uploadDir + '/' + img, function (err) {

            if (err) return cb(err);

            return cb(null);
        });
    }, function (err) {
        if (err) return cb(err);

        return cb(null);
    });

}

// export an object that contains all the above functions
module.exports = {
    checkExists: checkExists,
    upload: upload,
    deleteImgs: removeImgs
};
