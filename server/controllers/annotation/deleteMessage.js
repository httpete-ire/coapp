var Design = require('./../../models/design');

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

            design.save(function (err) {
                if(err) {
                    return next(err);
                }
                return res.status(201).json(messages);
            }
        );

    });
};