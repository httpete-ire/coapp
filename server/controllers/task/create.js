var Validator = require('./../../helpers/validator.js');
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
 * @apiParam {Object ID} assignedTo ID of user task is assign to
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

        console.log('working');

        // get design
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

        var task = new Task ();

        task.action = req.body.action;
        task.project = design.project;
        task.assignedTo = req.body.assignedTo;
        task.assignedBy = req.user._id;
        task.design = design._id;

        task.save(function (err) {
            if (err) {
                return cb(err);
            }

            cb(null, design, task);
        });

    },function (design, task, cb) {
        // add to db
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

            var annotation = design.annotations.id(req.params.annotationid);

            if(!annotation) {
                return callback({
                    message: 'no annotation found',
                    status: 404
                });
            }

            annotation.task = task._id;

            design.save(function(err) {
                if (err) return callback(err);

                return callback(null);
            });

        }], function (err) { // handle parallel callback
            if(err) return cb(err);

            cb(null);
        });

    }], function (err) {
        if (err) return next(err);

        return res.sendStatus(201);
    });


};