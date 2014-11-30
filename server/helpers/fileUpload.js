var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var _ = require('underscore');

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

module.exports = {
    checkExists: checkExists
};
