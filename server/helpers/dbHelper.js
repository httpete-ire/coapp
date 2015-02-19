var Task = require('./../models/task');
var Project = require('./../models/project');
var config = require('./../config');


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
 * create an activity in the activity list of a project
 *
 * @return {[type]} [description]
 */
module.exports.createActivity =  function (id, activity, callback) {

    // find project
    // ensure there are no more then four activites
    // and add activity
    Project
    .findOne({_id: id})
    .exec(function (err, project) {

        if(err) {
            return callback(err);
        }

        if(!project) {
            return callback({
                message: 'no project found',
                status: 404
            });
        }

        // add to recent activites of project
        project.recentActivities.push(activity);

        // remove the oldest activity
        if (project.recentActivities.length === config.maxActivites) {
            project.recentActivities.shift();
        }

        project.save(function(err) {
            if(err) {
                return callback(err);
            }

            callback(null);
        });

    });
};