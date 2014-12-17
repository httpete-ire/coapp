var _ = require('underscore');

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
        return res.status(422).send(validator.getErrors());
    } else {

        Design
            .findOne({_id: req.params.designid})
            .exec(function(err, design){

                if(err) {
                    console.log(err);
                } else {

                    if(!design) {
                        return res.status(404).send('no design found');
                    } else {

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

                        console.log('here');

                        design.save(function(err){
                            console.log('asdcasdcasd');
                            if (err) {
                                console.log(err);
                            } else{
                                return res.sendStatus(201);
                            }
                        });
                    }
                }
            });
    }

};