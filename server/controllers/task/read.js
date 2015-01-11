var User = require('./../../models/user');
var Task = require('./../../models/task');

var async = require('async');

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

    async.waterfall([function (cb) {

        if (!req.user._id) {
            return cb({
                message: 'no user found with that id',
                status: 404
            });
        }

        // find user
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

        // find tasks that belong to the user

        var taskQuery = Task.find({_id: { $in: tasks }});

        var populateQuery = [{
            path: 'assignedBy',
            select: 'username email'
        }, {
            path: 'design',
            select: 'name img.thumbnail'
        }, {
            path: 'project',
            select: 'name'
        }];

        // populate the tasks sub documents
        taskQuery.populate(populateQuery);

        taskQuery.exec(function(err, tasks) {
            if (err) return cb(err);

            cb(null, tasks);
        });


    }], function (err, response) {
        // handle errors
        if (err) return next(err);

        // send tasks back
        res.json(response);
    });
};