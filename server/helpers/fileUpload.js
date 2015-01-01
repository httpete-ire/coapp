var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var _ = require('underscore');
var lwip = require('lwip');

var opts = {
    uploadsDir: './../../../public/media/uploads',
    tmpDir: './../../../public/media/tmp',
    thumbnail : {
        width: 450,
        height: 257
    }
};

function exists (dir) {
    'use strict';

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

function upload (fileInfo, cb) {

    // move image to upload directory
    fs.rename(fileInfo.path, fileInfo.uploadDir + '/' + fileInfo.name,
        function(err) {

            if(err) {
                cb(err);
            }

            // generate thumbnails
            lwip.open(fileInfo.uploadDir + '/' + fileInfo.name, function (err, image) {

                if (image) {
                    image.batch()
                    .resize(opts.thumbnail.width, fileInfo.dimensions.height / fileInfo.dimensions.width * opts.thumbnail.width)
                    .crop(0, 0, opts.thumbnail.width, opts.thumbnail.height)
                    .writeFile(fileInfo.uploadDir + '/thumbnails/' + fileInfo.name , function (err){

                        if(err) {
                            cb(err);
                        } else {
                            cb();
                        }

                    });
                }

            });

        });

}

module.exports = {
    checkExists: checkExists,
    upload: upload
};
