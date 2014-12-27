var Project = require('./../../models/project');
var User = require('./../../models/user');
var Validator = require('./../../helpers/validator.js');

module.exports =  function removeProject(req, res, next) {

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

    // validate data
    if (!validator.validate()) {
        return next({
            message: 'invalid data',
            status: 422,
            fields: validator.getErrors()
        });
    }

    // get the id from the URL
    var projectid = req.params.projectid;

    // remove project and if succesful
    // remove project reference from users
    Project
        .findOne({
            $and: [
                {_id: projectid},       // id of project
                {owner: req.user._id}   // owner id
            ]
        })
        .exec(function(err, project) {

            if (err) {
                return next(err);
            }

            if (!project){
                return next({
                    message: 'no project found with that id',
                    status: 404
                });
            }

            project.name = req.body.name;
            project.desc = req.body.desc;
            project.collaborators = req.body.collaborators || [];

            // ensure the owner is always a collaborator
            project.collaborators.push(req.user._id);

            project.save(function(err){
                if (err) {
                    return next(err);
                }

                return res.sendStatus(200);
            });

        });

};