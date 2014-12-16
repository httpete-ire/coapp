var Design = require('./../../models/design');

module.exports =  function (req, res, next) {

    Design
    .findOne({_id: req.params.designid})
    .exec(function(err, design){
        if(err) {
            console.log(err);
        }

        if(!design) {
            res.status(404).send('no design found');
        } else {
            // project exists so set on req object
            req.design = design;
            // call the next function
            return next();
        }
    });
};