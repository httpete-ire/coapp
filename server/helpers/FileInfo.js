/*jshint strict:false */
var config = require('./../config').upload;
var path = require('path');
var _ = require('underscore');
var sizeOf = require('image-size');

var opts = {
    uploadsDir: './../../public/media/uploads'
};

/**
 * store infomation about a file
 *
 * @param {Object} file [description]
 * @param {[type]} opt  [description]
 *
 */
function FileInfo (file, opt) {
    this.name = file.name;
    this.designName = createName(file.name);
    this.size = file.size;
    this.type = file.type;
    this.path = file.path;
    this.uploadDir = null;
    this.dimensions = sizeOf(file.path);
    this.modified = file.lastMod;
    this.deleteType = 'DELETE';
    this.opts = opt || {};
};

/**
 * set the uploadDir for the file
 *
 */
FileInfo.prototype.init = function () {
    this.uploadDir = path.resolve(__dirname + opts.uploadsDir  + '/' +  this.opts.project + '/');
}

/**
 * timestamp the name so we get no conflicts with names
 *
 */
FileInfo.prototype.safeName = function() {

    var name = this.name.substring(0, this.name.lastIndexOf('.'));

    var ext = path.extname(this.name);

    // replace whitespace with '-'
    name = name.replace(/\s/g, '-');

    // timestamp the name of the file
    // this prevents conflicts
    name += '-' + Date.now();

    this.name = name + ext;
};

/**
 * generate a URL for the image and thumbnail path
 *
 */
FileInfo.prototype.urls = function(req) {
    var _this = this;

    var baseUrl = 'http://' + req.headers.host;
    baseUrl += '/media/uploads';

    var projectId = _this.opts.project;

    _this.url = baseUrl + '/' +  projectId + '/' + encodeURIComponent(_this.name);

    // set thumbnail url
    _this.thumbnailUrl =  baseUrl + '/' +  projectId + '/thumbnails/' + encodeURIComponent(_this.name);
};

/**
 * validate the file based on file size and type
 *
 * @return {Object} containing if valid and msg
 */
FileInfo.prototype.validate = function() {
    var valid = true;
    var msg = '';

    if (this.size  > config.size) {
        valid = false;
        msg = 'File exceeds maximum upload size of ' + config.size.toString()[0] + ' mb';
    } else if (!_.contains(config.types, path.extname(this.name))) {
        valid = false;
        msg = 'File type not supported';
    }

    return {
        valid: valid,
        msg: msg
    };
};

/**
 * remove - from the name and Capitalise the first letter
 *
 * @param  {String} name
 *
 * @return {String} new name
 */
function createName(name) {
    var newName = name.replace(/-/g, ' ');

    return newName.charAt(0).toUpperCase() + newName.slice(1, newName.indexOf('.'));
}

// export the constructor
module.exports =  FileInfo;