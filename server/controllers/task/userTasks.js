var User = require('./../../models/user');
var Task = require('./../../models/task');
var Design = require('./../../models/design');
var Project = require('./../../models/project');
var taskHelper = require('./../../helpers/taskHelper');

var async = require('async');
var _ = require('underscore');

// database populattion settings
var populateQuery = {
    'design' : {
        path: 'design',
        select: 'name img.thumbnail project'
    },
    'project' : {
        path: 'design.project',
        select: 'name'
    }
};

/**
 * database query to group tasks by designs
 *
 * @type {Object}
 *
 */
var designGroup = {
    $group : {
        _id : '$design',
        design : {
            $first: '$design'
        },
        task: {
            $push: {
                _id: '$_id',
                action: '$action',
                isComplete: '$isComplete',
                assignedTo: '$assignedTo',
                assignedBy: '$assignedBy'
            }
        }
    }
}

/**
 * @api {get} /api/tasks/ Get users task list
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

    async.waterfall([function (cb) { // find user

        if (!req.user._id) {
            return cb({
                message: 'no user found with that id',
                status: 404
            });
        }

        // find the logged in user and
        // their list of tasks
        User
        .findOne({_id: req.user._id})
        .exec(function(err, user){
            if (err) return cb(err);

            if (!user.tasks.length) {
                return cb({
                    message: 'no tasks found',
                    status: 404
                });
            }

            cb(null, user.tasks);
        });

    }, function (tasks, cb) {

        // group tasks by design
        var taskQuery = Task.aggregate([
            { '$match' : {_id: { $in: tasks }}},
            designGroup
        ]);

        // execute database query
        taskQuery.exec(function(err, tasks) {
            if (err) return cb(err);

            if (!tasks.length) {
                return cb({
                    message: 'no tasks found',
                    status: 404
                });
            }

            cb(null, tasks);

        });

    }, function (tasks, cb) {

        // populate the design objects
        Design.populate( tasks, populateQuery.design, function(err,tasks) {
            if (err) throw err;
            cb(null, tasks);
        });

    }, function (tasks, cb) {

        // populate the project objects
        Project.populate( tasks, populateQuery.project, function(err,tasks) {
            if (err) throw err;

            cb(null, tasks);
        });

    }, function (tasks, cb) {

        // loop over every task and poppulate its user objects
        taskHelper.populateTasks(tasks, cb);

    }], function (err, response) {
        // handle errors
        if (err) return next(err);

        // finally group tasks and design under specific projects
        response = _.groupBy(response, function (task) {
            return task.design.project.name;
        });

        // send tasks back
        res.json(response);

    });
};