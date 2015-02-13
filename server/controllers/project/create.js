var Project = require('./../../models/project');
var User = require('./../../models/user');
var Validator = require('./../../helpers/validator.js');

var _ = require('underscore');
var async = require('async');

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

    async.waterfall([function (cb) {

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

        // validate data and return err if invalid
        if (!validator.validate()) {
            return cb({
                message: 'invalid data',
                status: 422,
                fields: validator.getErrors()
            });
        }

        return cb(null)


    }, function (cb) {

        Project.findOne({
            $and: [
                {name: req.body.name},
                {owner: req.user._id}
            ]
        }).exec(function (err, project){
            if (err) {
                return cb(err);
            }

            if (project) {
                // project already exists so return conflict error
                return cb({
                    message: req.body.name + ' is already used',
                    status: 409
                });
            }

            cb(null);
        });

    }, function (cb) {

        // no project found so we can create a new one
        var project = new Project();

        project.name = req.body.name;
        project.desc = req.body.desc;

        // set the owner to the user logged in
        project.owner = req.user._id;

        addCollaborators(req.body.collaborators, project);

        // create a new activity
        project.recentActivities.push({
            activityType: 'new project',
            completedBy: req.user._id,
            design: null
        });

        // save project
        project.save(function (err) {
            if(err) {
                return cb(err);
            }

            cb(null, project);
        });


    }, function (project, cb) {
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
    }], function(err) {
         if (err) {
            return next(err);
        }

        return res.send(201);
    });
};

/**
 * add collaborators to the project
 *
 * @param {Array} collaborators
 * @param {Object} project
 */
function addCollaborators (collaborators, project) {

    // if their are no collaborators add the owner as one
    if (!collaborators || !collaborators.length) {
        project.collaborators.push(project.owner);
        return;
    }

    var collabArray = [];

    if (collaborators.length > 1) {
        collabArray = collaborators;
    } else { // only one collaborator add them and the owner
        collabArray.push(req.body.collaborators);
    }

    // add the owner
    collabArray.push(project.owner);

    // bind to project object
    _.each(collabArray, function (user) {
            project.collaborators.push(user);
    });

}