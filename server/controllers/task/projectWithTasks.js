var User = require('./../../models/user');
var Task = require('./../../models/task');
var Project = require('./../../models/project');

var async = require('async');
var _ = require('underscore');

/**
 * @api {get} /api/tasks/projects Get a list of projects the user has tasks in
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

        // find the users tasks and
        // group by design
        Task.find({
            _id: {
                $in: tasks
            }
        })
        .distinct('project')
        .exec(function (err, projects) {
            if(err) {
                console.log(err);
                return cb(err);
            }

            cb(null, projects);
        });

    }, function (projects, cb) {

        // retrieve the projects name and images
        Project.find({
            _id: {
                $in: projects
            }
        })
        .select('name thumbnail')
        .exec(function(err, projects){
            if (err) {
                return cb(err);
            }

            return cb(null, projects);
        })


    }], function (err, response) {
        // handle errors
        if (err) return next(err);

        // send tasks back
        res.json(response);

    });
};