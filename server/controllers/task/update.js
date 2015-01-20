var Task = require('./../../models/task');
var Validator = require('./../../helpers/validator.js');

var async = require('async');

module.exports =  function updateTask (req, res, next) {

    async.waterfall([function (cb) {

        // validate data
        var validator = new Validator();

        validator.addRule({
            field: 'action',
            value: req.body.action,
            rules: ['required']
        });

        validator.addRule({
            field: 'isComplete',
            value: req.body.isComplete,
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


    }, function (cb) { // find task by id

        Task
        .findOne({_id: req.params.taskid})
        .exec(function (err, task) {
            if (err) {
                return cb(err);
            }

            if (!task) {
                return cb({
                    message: 'no task found',
                    status: 404
                });
            }

            cb(null, task);
        });

    }, function (task, cb) { // update values

        task.action = req.body.action;
        task.isComplete = req.body.isComplete;

        task.save(function (err) {
            if (err) {
                return cb(err);
            }

            cb(null);
        });

    }, function (cb) {

        //
        // if task marked as complete
        // find the project it belongs too
        // and add as activity
        //


        cb(null);
    }],function (err) {
        if (err) return next(err);

        return res.sendStatus(200);
    });
};