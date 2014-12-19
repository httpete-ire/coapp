var Project = require('./../../models/project');
var User = require('./../../models/user');
var rmdir = require('rimraf');
var path = require('path');
var mediaPaths = './../../../public/media/uploads';



/**
 * @api {delete} /api/projects/:projectid Delete project
 *
 * @apiName Delete project
 * @apiGroup Projects
 *
 * @apiPermission User and Owner of project
 *
 * @apiUse NotAuthorized
 *
 * @apiUse ProjectNotFound
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 Ok
 */
module.exports =  function removeProject(req, res, next) {

    // get the id from the URL
    var projectid = req.params.projectid;

    // remove project and if succesful
    // remove project reference from users
    Project
        .findOneAndRemove({
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

            User.update({
                    // update every user who is a
                    // collaborator on the project
                    _id: { $in: project.collaborators }
                }, {
                    // pull the project id from the user
                    $pull: { projects : project._id}
                }, {
                    multi:true
                }, function(err, numEffected) {

                    var projectDir = path.resolve(__dirname + mediaPaths + '/' + projectid);

                    // delete project directory
                    rmdir(projectDir, function(err){

                        if (err) {
                            return next(err);
                        }

                        res.sendStatus(200);

                    });
                }
            );
        });

};