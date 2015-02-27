var async = require('async');

var Design = require('./../../models/design.js');

/**
 * @api {delete} /api/designs/:designid/annotaions/:annotationid Delete annotaion
 *
 * @apiName Delete annotation from design
 * @apiGroup Annotation
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function (req, res, next) {


    async.waterfall([function (cb) {
        // find a design
        Design.findOne({
            _id: req.params.designid
        })
        .exec(function(err, design) {
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

        // ensure only the owner of the annotation can delete it
        if(!annotation.owner.equals(req.user._id)) {
            return cb({
                message: 'you must be the owner of the annoatation to delete it',
                status: 403
            })
        }

        // remove it
        annotation.remove();

        design.save(function(err){
            if(err) return cb(err);

            cb(null);
        });

    }], function (err) {
        if (err) return next(err);

        return res.send(200);
    });
};