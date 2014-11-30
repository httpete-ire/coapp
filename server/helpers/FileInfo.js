var config = require('./../../config').upload;
var path = require('path');
var _ = require('underscore');

function FileInfo (file, opt) {
  this.name = file.name;
  this.size = file.size;
  this.type = file.type;
  this.modified = file.lastMod;
  this.deleteType = 'DELETE';
  this.opts = opt || {};
};

FileInfo.prototype.safeName = function() {

    var name = this.name.substring(0, this.name.lastIndexOf('.'));

    var ext = path.extname(this.name);

    // replace whitesoace with '-'
    name = name.replace(/\s/g, '-');

    // timestamp the name of the file
    // this prevents conflicts
    name += '-' + Date.now();

    this.name = name + ext;
};

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
 * @return {Object} containing if valid and msg
 */
FileInfo.prototype.validate = function() {
    var valid = true;
    var msg = '';

    if (this.size  > config.size) {
        valid = false;
        msg = 'File exceeds maximum upload size';
    } else if (!_.contains(config.types, path.extname(this.name))) {
        valid = false;
        msg = 'File type not supported';
    }

    return {
        valid: valid,
        msg: msg
    };
};

module.exports =  FileInfo;
