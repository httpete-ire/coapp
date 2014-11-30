var _ = require('underscore');
var formidable = require('formidable');
var fs = require('fs');
var lwip = require('lwip');
var path = require('path');
var FileInfo = require('./../../helpers/FileInfo.js');

var Movie = require('./../../models/movies.js');
var User = require('./../../models/user.js');


var opts = {
    uploadsDir: './../../../public/media/uploads',
    tmpDir: './../../../public/media/tmp',
    thumbnail : {
    	width: 200,
    	height: 200
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
						.resize(opts.thumbnail.width)
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

		// store fields
		fields[name] = value;

		// project directory
		projectDir = path.resolve(__dirname + opts.uploadsDir  + '/' +  req.user + '/');

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
			var movie = new Movie();

			movie.title = fields['title'];
			movie.rating = fields['rating'];
			movie.imgUrl = fileInfo.url;
			movie.thumbUrl = fileInfo.thumbnailUrl;

			movie.save(function(err){

				// get user
				// add
				console.log(movie);

				User.findOne({_id: '546cb5f9fc2c7ebcefd22990'}, function (err, user) {
					user.movies.push(movie._id);

					user.save(function(err){
						res.send(user);
					});
				});

			});

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
    res.send('<form action="/api/uploads" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><br><input type="text" name="title" /><br><br><input type="text" name="rating" /><br><input type="submit" name="submit" value="Submit"></form>');
}
