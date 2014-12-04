var Project = require('./../../models/project');
var User = require('./../../models/user');

var _ = require('underscore');


module.exports =  function (req, res, next) {

    // get user
    // get list of projects
    // get projects
    User
    .findOne({_id: req.user._id})
    .exec(function (err, user) {
        if (err) {
            console.log(err);
        } else{

            // get users projects
            var projectIds = user.projects;

            if (!projectIds) {
                // return no projects
            }

            // store DB query
            var query = Project.find();

            if(!_.isEmpty(req.query)) {
                // object of url queries
                var fields = _.keys(req.query);
            }

            // search projects using the ids of the user
            query.where({_id: {
                $in: projectIds
            }});

            // if the query string join to create a string
            if (fields) {

                // select certain fields to display
                query.select(fields.join(' '));

                // populate user objects on database
                if(_.contains(fields, 'collaborators')){
                    query.populate('collaborators');
                }
            }

            // execute query
            query.exec(function(err, projects) {
                if (err) {
                    console.log(err);
                } else{
                    res.json(projects);
                }
            });
        }
    });
};