var Project = require('./../../models/project');
var User = require('./../../models/user');
var _ = require('underscore');
var Validator = require('./../../helpers/validator.js');

'use strict';

/**
 * @api {post} /api/projects Add project
 *
 * @apiName Add new project
 * @apiGroup Projects
 *
 * @apiParam {String} name Project name
 * @apiParam {String} desc Project description
 * @apiParam {String} collaborators ID's of project collaborators
 *                    (seperated by a comma)
 *
 * @apiPermission User
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *
 * @apiError Conflict You can only have one project with the same name
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "'You can only have one project with the same name'"
 *     }
 *
 * @apiUse InvalidData
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function newProject (req, res, next) {


    // use async library
    // then create new activity in project timeline list

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

    // start prooject query
    var query = Project.findOne();

    // ensure a user can only have one project
    // with the same name
    query.where({
        $and: [
            {name: req.body.name},
            {owner: req.user._id}
        ]
    });

    // ensure a user can only have one project with the same name
    query.exec(function (err, project) {

        if (err) {
            return next(err);
        }

        if (project) {
            // project already exists so return conflict error
            return next({
                message: req.body.name + ' is already used',
                status: 409
            });
        }

        var project = new Project();
        var collaborators = [];

        project.name = req.body.name;
        project.desc = req.body.desc;

        // set the owner to the user logged in
        project.owner = req.user._id;

        /**
         * check if collaborators is defined
         */
        if (req.body.collaborators.length) {

            // if collaborators is sepearted by a comma
            // create an array with them and the owner
            if (req.body.collaborators.length > 1) {
                collaborators = req.body.collaborators;
            } else { // only one collaborator add them and the owner
                collaborators.push(req.body.collaborators);
            }
            collaborators.push(project.owner);
        } else { // else add the owner to the collaborators list
            collaborators = [project.owner];
        }

        // set project collaborator list
        _.each(collaborators, function (user) {
            project.collaborators.push(user);
        });

        // save project
        project.save(function (err) {
            if(err) {
                return next(err);
            }

            // update every user who is listed as a collaborator
            // and add the project to their project list
             User
            .update({ _id: {$in: project.collaborators}},
                    // add project to user
                    {$addToSet : { projects : project._id} },
                    {multi:true},
                    function(err, numEffected) {

                        if (err) {
                            return next(err);
                        }

                        res.send(201);
                    }
            );

        });

    });

};