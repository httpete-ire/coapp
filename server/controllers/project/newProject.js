var Project = require('./../../models/project');
var User = require('./../../models/user');


module.exports =  function newProject (req, res, next) {
    'use strict';

    var query = Project.findOne();

    query.where({name: req.body.name});

    query.exec(function (err, project) {

        if (project) {
            res.status(403).send(req.body.name + ' is already used');
        } else{
            var project = new Project();

            project.name = req.body.name;
            project.desc = req.body.desc;
            project.owner = req.user._id;

            // to do add list of collaborators
            // use ID of user object
            project.collaborators.push(req.user._id);

            // save project
            project.save(function (err) {
                if(err) {
                    res.send(500);
                } else {
                    // store reference to project in user object
                    //
                    // get collaborators and store refrence to project in object
                    User
                        .findOne({_id: req.user._id})
                        .exec(function(err, user){
                            user.projects.push(project._id);

                            user.save(function(err){
                                res.send(200);
                            });
                        });
                }
            });
        }
    });

};