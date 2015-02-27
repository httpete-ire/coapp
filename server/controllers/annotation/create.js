var Design = require('./../../models/design');
var Task = require('./../../models/task');
var User = require('./../../models/user');
var Project = require('./../../models/project');

var Validator = require('./../../helpers/validator.js');
var dbHelper = require('./../../helpers/dbHelper.js');


var async = require('async');

/**
 * @api {post} /api/designs/:designid/annotaions Add new annotaion
 *
 * @apiName Add annotaion to design
 * @apiGroup Annotation
 *
 * @apiParam {String} body Body of message
 * @apiParam {Number} x x position of message
 * @apiParam {Number} y y position of message
 * @apiParam {String} color color of mark
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function newAnnotation (req, res, next) {

    async.waterfall([function(cb) {

        // validate data
        var validator = new Validator();

        validator.addRule({
            field: 'body',
            value: req.body.body,
            rules: ['required']
        });

        validator.addRule({
            field: 'x postition',
            value: req.body.circle.x,
            rules: ['required']
        });

        validator.addRule({
            field: 'y postition',
            value: req.body.circle.y,
            rules: ['required']
        });

        if (!validator.validate()) {
            return cb({
                message: 'invalid data',
                status: 422,
                fields: validator.getErrors()
            });
        }

        cb(null);

    }, function (cb) {

        Design
        .findOne({
            _id: req.params.designid
        })
        .exec(function (err, design) {
            if (err) return cb(err);

            if(!design) {
                return cb({
                    message: 'no design found',
                    status: 404
                });
            }

            cb(null, design);
        });

    }, function (design, cb) {

        // if the request body has an assignedTo value we create a new task
        if(req.body.assignedTo) {

            var task = new Task ();

            // bind values to the task object
            task.action = req.body.body;
            task.project = design.project;
            task.assignedTo = req.body.assignedTo;
            task.assignedBy = req.user._id;
            task.design = design._id;
            task.annotation = {};
            task.annotation.type = req.body.type;
            task.annotation.number = (design.annotations.length + 1);

            task.save(function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, design, task);
            });

        } else {
            cb(null, design, null);
        }

    },function (design, task, cb) { // save annotation

        var taskId;

        // if there is a task
        // set id and add the task to a design
        if (task ) {
            taskId = task._id;
             // add new task to design
            design.tasks.push(taskId);
        } else {
            taskId = null;
        }

        // push annotation and add task
        design.annotations.push({
            body: req.body.body,
            owner: req.user._id,
            task: taskId,
            created: Date.now(),
            isTask: false,
            circle: {
                x: req.body.circle.x,
                y: req.body.circle.y
            },
            type: req.body.type,
            priority: req.body.priority || false,
            number: (design.annotations.length + 1)
        });

        design.save(function(err){
            if (err) {
                return cb(err);
            }

            cb(null, design, task);
        });

    }, function (design, task, cb) {

        // no task so return callback
        if (!task) {
            return cb(null, design, task);
        }

        // if task is set, push the task to the user
        // who the task is assigned to
        User.findOne({
            _id: req.body.assignedTo
        })
        .exec(function (err, user) {
            if (err) return cb(err);

            user.tasks.push(task);

            user.save(function (err) {
                if (err) return cb(err);

                cb(null, design, task);
            });
        });


    }, function (design, task, cb) {

        // create a new activity
        var activity = {
            activityType: (!task) ? 'new annotation' : 'new task',
            completedBy: req.user._id,
            design: design._id
        };

        // add the new activity to the project
        dbHelper.createActivity(design.project, activity, cb);

    }], function (err) {
        if (err) {
            return next(err);
        }

        return res.sendStatus(201);
    });


};