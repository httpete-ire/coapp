var Task = require('./../../models/task');
var Design = require('./../../models/design');
var Project = require('./../../models/project');
var taskHelper = require('./../../helpers/taskHelper');

var async = require('async');
var _ = require('underscore');

/**
 * @api {get} /api/:designid/tasks Get users task list
 *
 * @apiName Get users tasks
 * @apiGroup Tasks
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function readTasks (req, res, next) {

    // find design and project
    async.waterfall([function (cb) {

        // find design
        Design
            .findOne({_id: req.params.designid})
            .select('tasks project')
            .exec(function (err, design) {
                if (err) return cb(err);

                cb(null, design);
            });

    }, function (design, cb) {

        // find project and select owner
        Project
            .findOne({_id: design.project})
            .select('owner')
            .exec(function (err, project) {
                if (err) return cb(err);

                cb(null, project, design);
            });

    }, function (project, design, cb) {

        // if user is the owner load all tasks
        if (req.user._id === project.owner + '') {
            ownerTasks(design, cb);
        } else {
            // otherwise only load the users tasks
            userTasks(design, req.user._id, cb);
        }

    }], function (err, response) {
        if (err) {
            return next(err);
        }

        res.send(response);
    });
}; // end of route handler

/**
 * for the owner of the project we fetch all tasks
 * belonging to the design
 *
 * @param  {Object}   design
 * @param  {Function} callback
 */
function ownerTasks (design, callback) {

    var taskQuery = {
        _id: {
            $in : design.tasks
        }
    };

    runQuery([
        function (cb) {
            taskHelper.getTasks(taskQuery, cb);
        }
    ], callback);
}

/**
 * for collabartors of a project we fetch both their tasks
 * and tasks assigned to other users
 *
 * @param  {Object}     design
 * @param  {ObjectID}   userid
 * @param  {Function}   callback
 */
function userTasks (design, userid,  callback) {

    var query = {
        user: generateQuery(design, {assignedTo: userid}),
        other: generateQuery(design, {assignedTo: { $ne: userid}})
    };

    var userQuery = [
        function (cb) {
            taskHelper.getTasks(query.user, cb);
        },
        function (cb) {
            taskHelper.getTasks(query.other, cb);
        }
    ];

    runQuery(userQuery, callback);
}

/**
 * execute the query in parallel which will return an array of tasks
 *
 * @param  {Array}   queryArray
 * @param  {Function} callback
 */
function runQuery (queryArray, callback) {
    // in parrell run a query to get the users tasks
    // and tasks assigned to other users
    async.parallel(queryArray, function (err, tasks) {
        if(err) return callback(err);

        return callback(null, tasks);
    });
}

/**
 * return a query object which will get run on the db
 *
 * @param  {Object} design
 * @param  {Object} typeQuery
 */
function generateQuery (design, typeQuery) {
    return { $and : [
        {
            design: design
        },
            typeQuery
        ]
    }
}