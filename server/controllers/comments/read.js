var Design = require('./../../models/design');

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
    Design.findOne({_id: req.params.designid})
        .populate('annotations.comments.owner', 'email username')
        .exec(function (err, design) {
            if (err) {
                return next(err);
            }

            if (!design) {
                return next({
                    message: 'no design found',
                    status: 404
                });
            }

            // remove
            var comments = design.annotations.id(req.params.annotationid)
            .comments;

            if(!comments) {
                return next({
                    message: 'no comments found',
                    status: 404
                });
            }

            // check if owner remove if so

            design.save(function (err) {
                if(err) {
                    return next(err);
                }
                return res.status(200).json(comments);
            }
        );

    });
};