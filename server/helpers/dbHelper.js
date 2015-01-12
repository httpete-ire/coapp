var Task = require('./../models/task');

var _ = require('underscore');
var async = require('async');


/**
 * build an array of populattion settings based
 * on the fields array and config array
 *
 * @param  {[type]} array   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
module.exports.popullateOpts =  function  (fields, config) {

    // if nothing passed to
    // function pass back an array so the app doesnt crash
    if (!fields || !config || !_.isArray(config)) {
        console.log('broken')
        return [];
    }
    // // options for population query
    var popOpts = [];

    // loop over every options and see if it
    // it is in the fields and if it is add
    // the popullation settings to the array
    _.each(config, function (opts) {
        if(_.contains(fields, opts.field)){
            if (_.isArray(opts.query)) {
                // array of queries so push each one seperately
                _.each(opts.query, function(query){
                    popOpts.push(query);
                });
            } else {
                popOpts.push(opts.query);
            }
        }
    });

    return popOpts;
};

/**
 * loop over array of annotations and
 * populate the task object
 *
 * @param  {Array}   annotations :: annotations to populate task
 * @param  {Function} callback   :: callback to call if err / success
 */
module.exports.populateTasks =  function (annotations, callback) {

    var opts = [{
        path: 'assignedBy',
        select: 'email username'
    }, {
        path: 'assignedTo',
        select: 'email username'
    }];

    // loop over each task and populate
    async.forEach(annotations, function (annotation, cb) {

        Task.populate(annotation.task, opts, function (err, data){

            if(err) return cb(err);

            cb(null);
        });

    }, function(err) {

        if (err) {
            return callback(err);
        }

        callback(null);

    });

};