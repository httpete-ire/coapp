var Design = require('./../../models/design');

/**
 * @api {delete} /api/design/:designid/annotations/:annotationid/messages/:messageid Delete message
 *
 * @apiName Delete message
 * @apiGroup Annotation
 *
 * @apiPermission User and Owner of message
 *
 * @apiUse NotAuthorized
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 */
module.exports =  function (req, res, next) {
    Design.findOne({_id: req.params.designid})
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
            var messages = design.annotations.id(req.params.annotationid)
            .messages;

            messages.id(req.params.messageid).remove();

            // check if owner remove if so

            design.save(function (err) {
                if(err) {
                    return next(err);
                }
                return res.status(201).json(messages);
            }
        );

    });
};