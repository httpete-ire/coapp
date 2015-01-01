var Design = require('./../../models/design');
var Validator = require('./../../helpers/validator.js');
/**
 * @api {post} /api/design/:designid/annotations/:annotationid/comments/:commentid Update comment
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

    var validator = new Validator();

    validator.addRule({
        field: 'body',
        value: req.body.body,
        rules: ['required']
    });

    // validate data
    if (!validator.validate()) {
        return next({
            message: 'invalid data',
            status: 422,
            fields: validator.getErrors()
        });
    }

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

            var annotation = design.annotations.id(req.params.annotationid);

            if (!annotation) {
                return next({
                    message: 'no annotation found',
                    status: 404
                });
            }

            var comment = annotation.comments.id(req.params.commentid);

            if (!comment) {
                return next({
                    message: 'no message found',
                    status: 404
                });
            }

            comment.body = req.body.body;

            design.save(function (err) {
                if(err) {
                    return next(err);
                }
                return res.status(201).json(annotation.comments);
            }
        );

    });
};