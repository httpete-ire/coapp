var Design = require('./../../models/design');
var Project = require('./../../models/project');
var User = require('./../../models/user');

var taskHelper = require('./../../helpers/taskHelper');
var dbHelper = require('./../../helpers/dbHelper');

var async = require('async');
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

    async.waterfall([function (cb) {

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

            var opts = getPopullateOptions(fields);

            designQuery.populate(opts);

        }

        // run design query
        designQuery.exec(function(err, design){
            if (err) return cb(err);

            if (!design) {
                return cb({
                    message: 'no design found',
                    status: 404
                });
            }

            cb(null, design);
        });

    }, function (design, cb) {

        populateData(design, cb);

    }], function (err, design) {

        if (err) return next(err);

        return res.status(200).json(design[0]);

    });
};

/**
 * populate the project and tasks of each annotation
 * of the design, this happens in parallel to prevent blocking the system
 *
 * @param  {Object}   design :: design object
 * @param  {Function} cb     :: callback to execute if successful
 */
function populateData (design, cb) {
    // in parrell load populate project and tasks
    async.parallel([function (callback) {

        var opts = {
            path: 'collaborators',
            select: 'email username'
        };

        // populate project
        Project.populate(design.project, opts, function (err) {

            if(err) return callback(err);

            return callback(null, design);
        });

    }, function (callback) {

        taskHelper.populateTasks(design.annotations, callback);

    }], function (err, design){

        if(err) {
            return cb(err);
        }

        return cb(null, design);
    });
};

function getPopullateOptions (array) {

    // config settings for popullation
    var popFields = [{
        field: 'owner',
        query: {
            path: 'owner', select: 'email username'}
    }, {
        field: 'project',
        query: {
            path: 'project', select: 'collaborators name owner'}
    }, {
        field: 'annotations',
        query: [{
            path: 'annotations.owner', select: 'email username'
        }, {
            path: 'annotations.task'
        }, {
            path: 'annotations.comments.owner',
            select: 'email username'
        }]
    }];

    return dbHelper.popullateOpts(array, popFields);
}
