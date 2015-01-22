var Project = require('./../../models/project');
var Validator = require('./../../helpers/validator.js');
var User = require('./../../models/user');

var _ = require('underscore');
var async = require('async');

/**
 * @api {put} /api/projects Update project
 *
 * @apiName Update project
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
 *     HTTP/1.1 200 Ok
 *
 * @apiUse InvalidData
 *
 * @apiUse NotAuthorized
 *
 */
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

            // store old collabartors
            var oldCollaborators = project.collaborators;

            project.collaborators = req.body.collaborators || [];

            // always add the owner of the project
            project.collaborators.push(project.owner);

            project.save(function(err){

                if (err) {
                    return next(err);
                }

                async.series([
                    // add project to users
                    function (cb) {

                        // remove project form every user
                        updateUserProjects(oldCollaborators,
                            {$pull : { projects : project._id}}, cb);

                    },
                    // remove project to users
                    function (cb) {

                        // add project to new users
                        updateUserProjects(project.collaborators,{$push : { projects : project._id} }, cb);

                    }], function (err) {

                    if(err) {
                        return next(err);
                    }

                    return res.sendStatus(200);
                });
            }
        );
    });
};

/**
 * add or remove projects from users
 * depending on method provided
 *
 * @param  {Array}   arr     :: users to update
 * @param  {Object}   method :: method to run on db
 * @param  {Function} cb     :: callback function
 *
 */
function updateUserProjects (arr, method, cb) {

    if(_.isEmpty(arr)) {
        return cb();
    }

    User.update({_id: {$in: arr}},
    method,
    { multi:true },
    function (err) {
        if(err) return cb(err);

        return cb();
    });
}