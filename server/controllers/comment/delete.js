var Design = require('./../../models/design');
var async = require('async');
/**
 * @api {delete} /api/design/:designid/annotations/:annotationid/comments/:commentid Delete message
 *
 * @apiName Delete comment
 * @apiGroup Annotation
 *
 * @apiPermission User and Owner of comment
 *
 * @apiUse NotAuthorized
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 */
module.exports =  function (req, res, next) {

    async.waterfall([function (cb) {

        // find one design
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

        // get the annotations comments
        var comments = design.annotations.id(req.params.annotationid)
        .comments;

        // remove the specific comment
        comments.id(req.params.commentid).remove();

        design.save(function(err){
            if(err) return cb(err);

            cb(null);
        });

    }], function(err) {
        if(err) return next(err);
        return res.sendStatus(200);
    });

};