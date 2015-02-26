var Validator = require('./../../helpers/validator.js');
var dbHelper = require('./../../helpers/dbHelper.js');
var Design = require('./../../models/design');
var Task = require('./../../models/task');
var User = require('./../../models/user');

var async = require('async');

/**
 * @api {post} /api/designs/:designid/annotations/:annotationid/tasks
 *
 * @apiName Add new task
 * @apiGroup Tasks
 *
 * @apiParam {String} action Tasks action to complete
 * @apiParam {Object} assignedTo ID of user task is assign to
 *
 * @apiPermission User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiUse InvalidData
 *
 * @apiUse NotAuthorized
 */
module.exports =  function createTask (req, res, next){

    async.waterfall([function (cb) {

        // validate data
        var validator = new Validator();

        validator.addRule({
            field: 'action',
            value: req.body.action,
            rules: ['required']
        });

        validator.addRule({
            field: 'assignedTo',
            value: req.body.assignedTo,
            rules: ['required']
        });

        // validate data
        if (!validator.validate()) {
            return cb({
                message: 'invalid data',
                status: 422,
                fields: validator.getErrors()
            });
        }

        cb(null);

    },function (cb) {

        // query for the specfic design
        Design
            .findOne({_id: req.params.designid})
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

        // serach the designs annotation sub-document
        var annotation = design.annotations.id(req.params.annotationid);

        if(!annotation) {
            return cb({
                message: 'no annotation found',
                status: 404
            });
        }

        cb(null, design, annotation);


    }, function (design, annotation, cb) {

        // creae a new task and bind values to it
        var task = new Task ();

        task.action = req.body.action;
        task.project = design.project;
        task.assignedTo = req.body.assignedTo;
        task.assignedBy = req.user._id;
        task.design = design._id;

        task.annotation.type = annotation.type;
        task.annotation.number = design.annotations.length;

        task.save(function (err) {
            if (err) {
                return cb(err);
            }

            cb(null, design, task, annotation);
        });

    },function (design, task, annotation, cb) {

        // in parallel insert the task into the user object,
        // add it to the list of tasks in the design and create
        // a new activity in the project model
        async.parallel([function (callback) {

            // add to user db
            User
                .findOne({_id: req.user._id})
                .exec(function (err, user) {
                    if(err) return callback(err);

                    if (user) {
                        user.tasks.push(task._id);
                    }

                    user.save(function (err) {
                        if (err) return callback(err);

                        callback(null);
                    });
                });
        }, function (callback) {

            // add to design and push to annotation
            design.tasks.push(task._id);

            annotation.task = task._id;

            design.save(function(err) {
                if (err) return callback(err);

                return callback(null);
            });

        }, function (callback) {

            var activity = {
                activityType: 'new task',
                completedBy: req.user._id,
                design: task.design
            };

            // add the activity to the project
            dbHelper.createActivity(task.project, activity, cb);

        }], function (err) { // handle parallel callback
            if(err) return cb(err);

            cb(null);
        });

    }], function (err) {
        if (err) return next(err);

        return res.sendStatus(201);
    });


};