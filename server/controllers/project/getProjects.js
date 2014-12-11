var Project = require('./../../models/project');
var User = require('./../../models/user');

var _ = require('underscore');


/**
 * @api {get} /api/projects Get users projects
 *
 * @apiName Get users projects
 * @apiGroup Projects
 *
 * @apiUse ProjectExample
 *
 * @apiPermission User
 *
 * @apiUse ProjectFields
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function (req, res, next) {
    // find the logged in user so project ID's
    // cen be retrieved
    User
    .findOne({_id: req.user._id})
    .exec(function (err, user) {
        if (err) {
            console.log(err);
        } else{

            // get users projects
            var projectIds = user.projects;

            // store DB query
            var query = Project.find();

            if(!_.isEmpty(req.query)) {
                // object of url queries
                var queries = req.query;
            }

            // search projects using the ids of the user
            query.where({_id: {
                $in: projectIds
            }});

            // if the query string join to create a string
            if (queries && queries.fields) {

                // build an array of fields
                var fields = queries.fields.split(',');

                // join the array to build a string
                query.select(fields.join(' '));

                // populate user objects on database
                if(_.contains(fields, 'collaborators')){
                    query.populate('collaborators', 'email username');
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