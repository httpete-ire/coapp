var Design = require('./../../models/design');
var Validator = require('./../../helpers/validator.js');

var async = require('async');

/**
 * @api {post} /api/design/:designid/annotations/:annotationid/comments New comment
 *
 * @apiName Add new comment to annotation
 * @apiGroup Annotation
 *
 * @apiParam {String} body Body of reply
 *
 * @apiPermission User
 * @apiUse NotAuthorized
 *
 */
module.exports =  function (req, res, next) {

    async.waterfall([function(cb){ // validate data

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

    }, function(cb) { // get design

        Design.findOne({_id: req.params.designid})
            .exec(function (err, design) {
                if (err) {
                    return cb(err);
                }

                if (!design) {
                    return cb({
                        message: 'no design found',
                        status: 404
                    });
                }

                cb(null, design);
            });

    }, function(design, cb){ // save comment

        var annotation = design.annotations.id(req.params.annotationid);

        if(!annotation) {
            return cb({
                message: 'no annotation found',
                status: 404
            });
        }

        annotation.comments.push({
            body: req.body.body,
            owner: req.user._id
        });

        design.save(function (err) {
            if(err) {
                return cb(err);
            }

            cb(null, annotation.comments)
        });

    }], function (err) {
        if(err) {
            return next(err);
        }

        return res.sendStatus(200);
    });

};
