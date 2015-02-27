var Design = require('./../../models/design');
var Validator = require('./../../helpers/validator.js');

var async = require('async');

/**
 * @api {put} /api/designs/:designid/annotaions Update annotaion
 *
 * @apiName Update annotation
 * @apiGroup Annotation
 */
module.exports =  function (req, res, next) {

    async.waterfall([function (cb) {

        // validate new data
        var validator = new Validator();

        validator.addRule({
            field: 'x postition',
            value: req.body.x,
            rules: ['required']
        });

        validator.addRule({
            field: 'y postition',
            value: req.body.y,
            rules: ['required']
        });

        if (!validator.validate()) {
            return cb({
                message: 'invalid data',
                status: 422,
                fields: validator.getErrors()
            });
        }

        cb(null);

    }, function (cb) {

        Design
        .findOne({
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

        var annotation = design.annotations.id(req.params.annotationid);

        if(!annotation) {
            return cb({
                message: 'no annotation found',
                status: 404
            });
        }

        // update the annotation
        annotation.body = req.body.body || annotation.body;
        annotation.circle.x = req.body.x;
        annotation.circle.y = req.body.y;

        cb(null, design);

    }, function (design, cb) {

        design.save(function (err) {

            if(err) {
                return cb(err);
            }

            cb(null);

        });

    }], function(err) {
        if (err) {
            return next(err);
        }

        return res.sendStatus(200);
    });

};