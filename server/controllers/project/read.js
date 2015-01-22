var Project = require('./../../models/project');

var _ = require('underscore');

var async = require('async');

var dbHelper = require('./../../helpers/dbHelper');

/**
 * @api {get} /api/projects/:projectid Get single project
 *
 * @apiName Get single project
 * @apiGroup Projects
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 * @apiUse ProjectFields
 *
 * @apiUse ProjectExample
 *
 * @apiUse ProjectNotFound
 *
 */
module.exports =  function (req, res, next) {

    // get the id from the URL
    var projectid = req.params.projectid;

    // get id
    // build string of fields
    var projectQuery = Project.findOne();

    // select project by id
    projectQuery.where({_id: projectid});

    // use the fields query to select properties to return
    if (!_.isEmpty(req.query) && req.query.fields) {
        // build an array of fields
        var fields = req.query.fields.split(',');

        // join the array to build a string
        projectQuery.select(fields.join(' '));

        var opts = getPopullateOptions(fields);

        projectQuery.populate(opts);
    }

    projectQuery.exec(function (err, project) {
        if (err) {
            return next(err);
        }

        if(!project) {
            return next({
                message: 'no project found',
                status: 404
            });
        }

        res.status(200).json(project);
    });
};

function getPopullateOptions (array) {

    var popFields = [{
        field: 'collaborators',
        query: {
            path: 'collaborators', select: 'email username'
        }
    }, {
        field: 'designs',
        query: {
            path: 'designs', select: 'name img.thumbnail'
        }
    }, {
        field: 'recentActivities',
        query: [{
            path: 'recentActivities.completedBy',
            select: 'username'
        },{
            path: 'recentActivities.design',
            select: 'name'
        }]
    }];

    return dbHelper.popullateOpts(array, popFields);
}
