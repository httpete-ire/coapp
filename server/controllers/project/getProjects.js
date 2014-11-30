var Project = require('./../../models/project');
var User = require('./../../models/user');


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

            var query = Project.find();

            // search projects using the ids of the users
            // projects
            query.where({_id: {
                $in: projectIds
            }});

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