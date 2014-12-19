var Design = require('./../../models/design');

module.exports =  function (req, res, next) {

    Design
    .findOne({_id: req.params.designid})
    .exec(function(err, design){
        if(err) {
            return next(err);
        }

        if(!design) {
            return next({
                message: 'no design found',
                status: 404
            });
        } else {
            // project exists so set on req object
            req.design = design;
            // call the next function
            return next();
        }
    });
};