var Design = require('./../../models/design');
var Validator = require('./../../helpers/validator.js');
var async = require('async');

/**
 * @api {put} /api/design/:designid/annotations/:annotationid/comments/:commentid Update comment
 *
 * @apiParam {String} body comment body
 *
 * @apiName Update comment
 * @apiGroup Annotation
 *
 * @apiPermission User and Owner of comment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 */
module.exports =  function (req, res, next) {

    async.waterfall([function (cb) {

        // validate data
        var validator = new Validator();

        validator.addRule({
            field: 'body',
            value: req.body.body,
            rules: ['required']
        });

        // validate data
        if (!validator.validate()) {
            return cb({
                message: 'invalid data',
                status: 422,
                fields: validator.getErrors()
            });
        }

        cb(null);

    }, function (cb) {

        // find the correct annotation
        Design.findOne({
            _id: req.params.designid
        })
        .exec(function (err, design) {
            if (err) return cb(err);

            if(!design) {
                return cb({
                    message: 'no design found',
                    status: 404
                });
            }

            cb(null, design);
        });

    }, function (design, cb) {

        // find the correct annotation
        var annotation = design.annotations.id(req.params.annotationid);

        if (!annotation) {
            return cb({
                message: 'no annotation found',
                status: 404
            });
        }

        cb(null, annotation, design);

    }, function (annotation, design, cb) {

        // find the correct comment
        var comment = annotation.comments.id(req.params.commentid);

        if (!comment) {
            return cb({
                message: 'no comment found',
                status: 404
            });
        }

        // update the comment values
        comment.body = req.body.body;
        comment.update = Date.now();

        design.save(function (err) {
            if(err) {
                return cb(err);
            }

            cb(null);
        });

    }], function (err, response) {
        if (err) return next(err);

        return res.sendStatus(200);
    });

};