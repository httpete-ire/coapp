var Design = require('./../../../models/design');
var Validator = require('./../../../helpers/validator.js');
/**
 * @api {post} /api/design/:designid/annotations/:annotationid/messages/:messageid Update message
 *
 * @apiParam {String} body message body
 *
 * @apiName Update message
 * @apiGroup Annotation
 *
 * @apiPermission User and Owner of message
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

            var message = annotation.messages.id(req.params.messageid);

            if (!message) {
                return next({
                    message: 'no message found',
                    status: 404
                });
            }

            message.body = req.body.body;

            design.save(function (err) {
                if(err) {
                    return next(err);
                }
                return res.status(201).json(annotation.messages);
            }
        );

    });
};