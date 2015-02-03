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