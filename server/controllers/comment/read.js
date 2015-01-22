var Design = require('./../../models/design');

var async = require('async');

/**
 * @api {get} /api/design/:designid/annotations/:annotationid/comments/ Get comments
 *
 * @apiName Get comments
 * @apiGroup Annotation
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 *     [
 *       {
 *           "body": "I love it",
 *           "owner": {
 *               "_id": "5489c531dd18360563c13179",
 *               "email": "pete@coapp.com",
 *               "username": "pete"
 *           },
 *           "_id": "549ed6f946fc3383cdd2ff7d",
 *           "created": "2014-12-27T15:57:45.311Z"
 *       }
 *      ]
 */
module.exports =  function (req, res, next) {

    async.waterfall([function (cb){ // get design

        Design.findOne({_id: req.params.designid})
            .populate('annotations.comments.owner', 'email username')
            .exec(function (err, design) {
                if(err) {
                    return cb(err);
                }

                cb(null, design);
            });

    },function (design, cb) { // get comments
        // remove
        var comments = design.annotations.id(req.params.annotationid)
        .comments;

        if(!comments) {
            return cb({
                message: 'no comments found',
                status: 404
            });
        }

        return cb(null, comments);

    }], function (err, response) { // handle err and response
        if(err) {
            return next(err);
        }

        return res.status(200).json(response);
    });
};