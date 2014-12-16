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

        if(_.contains(fields, 'annotaions')){
            designQuery.populate('annotaions.owner', 'email username');
        }

    }

    designQuery
    .exec(function(err, design){
        if (err) {
            console.log(err);
        } else {
            if (!design) {
                return res.status(404).send('no design found');
            } else {
                return res.status(200).json(design);
            }
        }
    });
};