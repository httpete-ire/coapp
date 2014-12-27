var Design = require('./../../models/design');
var Validator = require('./../../helpers/validator.js');

/**
 * @api {post} /api/designs/:designid/annotaions Add new annotaion
 *
 * @apiName Add annotaion to design
 * @apiGroup Designs
 *
 * @apiParam {String} body Body of message
 * @apiParam {Number} x x position of message
 * @apiParam {Number} y y position of message
 * @apiParam {String} color color of mark
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function newAnnotation (req, res, next) {


    var validator = new Validator();

    validator.addRule({
        field: 'body',
        value: req.body.body,
        rules: ['required']
    });

    validator.addRule({
        field: 'x postition',
        value: req.body.circle.x,
        rules: ['required']
    });

    validator.addRule({
        field: 'y postition',
        value: req.body.circle.y,
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

    Design
        .findOne({_id: req.params.designid})
        .exec(function(err, design){

            if(err) {
                next(err);
            }

            if(!design) {
                return next({
                    message: 'no design found',
                    status: 404
                })
            }

            design.annotations.push({
                body: req.body.body,
                owner: req.user._id,
                created: Date.now(),
                isTask: false,
                circle: {
                    x: req.body.circle.x,
                    y: req.body.circle.y
                }
            });

            design.save(function(err){

                if (err) {
                   return next(err);
                }

                return res.sendStatus(201);

            });

    });
};