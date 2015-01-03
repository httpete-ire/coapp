var Design = require('./../../models/design');
var Project = require('./../../models/project');

var async = require('async');
var path = require('path');
var fs = require('fs');

var fileUpload = require('./../../helpers/fileUpload.js');
var uploadsDir = './../../../public/media/uploads';

/**
 * @api {DELETE} /api/projects/:projectid/designs Delete design
 *
 * @apiName Delete design
 * @apiGroup Designs
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 * @apiError DesignNotFound The <code>id</code> of the Design was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No design found with that id"
 *     }
 *
 */
module.exports =  function (req, res, next) {

    var designId = req.params.designid;

    async.waterfall([
        // delete design from db
        function (cb) {
            Design
            .findOneAndRemove({ _id: designId })
            .exec(function(err, design){
                if(err) {
                    return cb(err);
                }

                if(!design) {
                    return cb({
                        message: 'no design found',
                        status: 404
                    });
                }

                return cb(null, design);
            });
        },
        // remove design from project
        function (design, cb) {
            Project
            .findOne({_id: design.project})
            .exec(function (err, project){
                if (err) {
                    return cb(err);
                }

                if(!project) {
                    return cb({
                        message: 'no project found',
                        status: 404
                    });
                }

                project.designs.pull(design._id);

                // decrement the counter
                --project.designCount;

                project.save(function(err, project){
                    if (err) {
                        return cb(err);
                    }

                    return cb(null, project, design);
                });
            });
        },
        // remove imgs
        function (project, design, cb) {

            // get indexOf project id in design URL, substring
            // the rest of the string
            var imgs = [design.img.full, design.img.thumbnail];

            fileUpload.deleteImgs(imgs, project._id, function (err) {
                if (err) return cb(err);

                cb(null);
            });

        }],
        // handle response
        function (err) {
        if (err) {
            return next(err);
        }

        return res.sendStatus(200);
    });
};