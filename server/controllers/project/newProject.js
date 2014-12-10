var Project = require('./../../models/project');
var User = require('./../../models/user');

var _ = require('underscore');

var Validator = require('./../../helpers/validator.js');

module.exports =  function newProject (req, res, next) {

    var validator = new Validator();

    validator.addRule({
        field: 'name',
        value: req.body.name,
        rules: ['required']
    });

    validator.addRule({
        field: 'desc',
        value: req.body.desc,
        rules: ['required']
    });

    if (!validator.validate()) {
        return res.send(validator.getErrors());
    }

    var query = Project.findOne();

    query.where({name: req.body.name});

    query.exec(function (err, project) {

        if (project) {
            res.status(403).send(req.body.name + ' is already used');
        } else{
            var project = new Project();
            var collaborators;

            project.name = req.body.name;
            project.desc = req.body.desc;
            project.owner = req.user._id;

            /**
             * check if collaborators is defined
             */
            if (req.body.collaborators) {

                // if collaborators is sepearted by a comma
                // create an array with them and the owner
                if (req.body.collaborators.indexOf(',') > -1) {
                    collaborators = req.body.collaborators.split(',').push(project.owner);
                } else {
                        collaborators.push(req.body.collaborators);
                }

            } else {
                collaborators = [project.owner];
            }

            // set project collaborator list
            _.each(collaborators, function (user) {
                project.collaborators.push(user);
            });

            // save project
            project.save(function (err) {
                if(err) {
                    res.send(500);
                } else {

                    /**
                     * Set project id in every user object
                     */
                     User
                    .update({ _id: {$in: collaborators}},
                            {$addToSet : { projects : project._id} },
                            {multi:true},
                            function(err, numEffected) {
                                if (err) {
                                    res.send(500);
                                } else{
                                    res.send(200);
                                }
                            }
                        );
                }
            });
        }
    });

};