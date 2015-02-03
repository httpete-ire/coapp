var Task = require('./../models/task');

var async = require('async');

/**
 * loop over array of annotations and
 * populate the task object
 *
 * @param  {Array}   annotations :: annotations to populate task
 * @param  {Function} callback   :: callback to call if err / success
 */
module.exports.populateTasks =  function (array, opts, callback) {

    // if the opts
    if (typeof opts === 'function') {
        callback = opts;

        opts = [{
            path: 'assignedBy',
            select: 'email username'
        }, {
            path: 'assignedTo',
            select: 'email username'
        }];
    };

    // loop over each task and populate
    async.forEach(array, function (item, cb) {

        Task.populate(item.task, opts, function (err, data){

            if(err) return cb(err);

            cb(null);
        });

    }, function(err) {

        if (err) {
            return callback(err);
        }

        callback(null, array);

    });

};