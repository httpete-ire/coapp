var _ = require('underscore');
var formidable = require('formidable');
var fs = require('fs');
var lwip = require('lwip');
var path = require('path');
var FileInfo = require('./../../helpers/FileInfo.js');

var User = require('./../../models/user.js');


var opts = {
    uploadsDir: './../../../public/media/uploads',
    tmpDir: './../../../public/media/tmp',
    thumbnail : {
    	width: 450
    }
};

var mkdirp = require('mkdirp');

/**
 * Controller to handle file upload
 *
 * project folder is created if it doesnt exist
 *
 * @url {URL} :: /api/uploads
 */
module.exports.post =  function uploadCtrl (req, res, next) {

	var form = new formidable.IncomingForm();

	// store all the files info in an object
	var fileInfo = null;

	var errors = [], // errors
		fields = {}, // formfields {Project}
		projectDir = ''; // name of project director

	form.uploadDir = path.resolve(__dirname + opts.tmpDir);

	form.on('file', function (name, file) {

		fileInfo = new FileInfo(file, {
			project: fields['project']
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

		// store form fields
		fields[name] = value;

		// project directory using the project form field
		projectDir = path.resolve(__dirname + opts.uploadsDir  + '/' +  fields.project + '/');

		// check if project and thumbnail directory
		// exists and create them if not
		_.each([projectDir, projectDir + '/thumbnails'], function (dir) {
			mkdirp.sync(dir);
		});

	});

	form.on('end', function () {

		// generate urls for images
		if(fileInfo) {
			fileInfo.urls(req);
		}

		if (errors.length) {
			res.status(400).send(errors[0]);
		} else {

			var html = '<a href="'+fileInfo.url+'">Full Image</a><br /><a href="'+fileInfo.thumbnailUrl+'">Thumbnail image</a>';

			res.send(html);
		}

	});

	form.parse(req);
}



/**
 * Controller to handle file upload
 *
 * project folder is created if it doesnt exist
 *
 * @url {URL} :: /api/uploads
 */
module.exports.get =  function uploadCtrl (req, res, next) {
    res.send('<form action="/api/uploads" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><br><input type="text" name="project" /><br><input type="submit" name="submit" value="Submit"></form>');
}
