var Design = require('./../../models/design');
var Validator = require('./../../helpers/validator.js');

/**
 * @api {post} /api/design/:designid/annotations/:annotationid/messages Add new
 *                                                                      message
 *
 * @apiName Add new message to annotation
 * @apiGroup Designs
 *
 * @apiParam {String} body Body of reply
 * @apiParam {String} username Username of sender
 *
 * @apiPermission User
 * @apiUse NotAuthorized
 *
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

            if(!annotation) {
                return next({
                    message: 'no annotation found',
                    status: 404
                });
            }

            var msg = {
                body: req.body.body,
                owner: req.user._id
            }

            annotation.messages.push(msg);

            design.save(function (err) {
                if(err) {
                    return next(err);
                }
                return res.status(201).json(annotation.messages);
            }
        );

    });
};