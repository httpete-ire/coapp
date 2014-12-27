var Project = require('./../../models/project');
var Validator = require('./../../helpers/validator.js');

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

    console.log(req.body);

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

            project.save(function(err){
                if (err) {
                    return next(err);
                }

                return res.sendStatus(200);
            });

        });

};