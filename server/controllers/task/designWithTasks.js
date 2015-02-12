var User = require('./../../models/user');
var Task = require('./../../models/task');
var Project = require('./../../models/project');
var Design = require('./../../models/design');

var async = require('async');
var _ = require('underscore');

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

    }, function (tasks, cb) { // group tasks by design

        Task.find({
            $and : [
                {
                    _id: {
                        $in: tasks
                    }
                },
                {
                    project : req.params.projectid
                }
            ]
        })
        .distinct('design')
        .exec(function (err, designs) {
            if(err) {
                return cb(err);
            }

            cb(null, designs);
        });
    }, function (designs, cb) {

        Design.find({
            _id: {
                $in: designs
            }
        })
        .select('name img')
        .exec(function(err, designs){
            if (err) {
                return cb(err);
            }

            return cb(null, designs);
        })


    }], function (err, response) {
        // handle errors
        if (err) return next(err);

        // send tasks back
        res.json(response);

    });
};