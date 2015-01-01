var Design = require('./../../models/design');
var _ = require('underscore');

/**
 * @api {get} /api/designs/:designid Get single design
 *
 * @apiName Get single design
 * @apiGroup Designs
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 * @apiUse DesignDexample
 *
 * @apiUse DesignFields
 *
 */
module.exports =  function getDesign (req, res, next) {

    var designId = req.params.designid;

    var designQuery = Design.findOne({
        _id: designId
    });

    // use the fields query to select properties to return
    if (!_.isEmpty(req.query) && req.query.fields) {
        // build an array of fields
        var fields = req.query.fields.split(',');

        // join the array to build a string
        designQuery.select(fields.join(' '));

        if(_.contains(fields, 'owner')){
            designQuery.populate('owner', 'email username');
        }

        if(_.contains(fields, 'annotations')){
            designQuery.populate('annotations.owner', 'email username');
            designQuery.populate('annotations.comments.owner', 'email username');
        }

    }

    designQuery
    .exec(function(err, design){
        if (err) {
            next(err);
        }

        if (!design) {
            return next({
                message: 'no design found',
                status: 404
            });
        }

        return res.status(200).json(design);
    });
};