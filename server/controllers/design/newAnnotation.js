var _ = require('underscore');

var Design = require('./../../models/design');

module.exports =  function newAnnotation (req, res, next) {

    Design
        .findOne({_id: req.design._id})
        .exec(function(err, design){

            design.annotaions.push({
                body: req.body.body,
                created: Date.now(),
                isTask: false,
                circle: {
                    x: req.body.x,
                    y: req.body.y
                }
            });

            design.save(function(err){
                if (err) {
                    console.log(err);
                } else{
                    return res.status(201);
                }
            });
        });




    res.send(req.design);

};