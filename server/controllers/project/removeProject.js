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
module.exports =  function removeProject(req,res,next) {

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
                console.log(err);
                res.status(500).send('server internal error');
            }

            if (!project){
                res.status(404).send('No project found with that id');
            } else {

                User.update({
                        // update every user who is a
                        // collaborator on the project
                        _id: {$in: project.collaborators}
                    }, {
                        // pull the project id from the user
                        $pull: { projects : project._id}
                    }, {
                        multi:true
                    }, function(err, numEffected) {

                        // when design route done
                        // remove designs and then folder
                        var projectDir = path.resolve(__dirname + mediaPaths + '/' + projectid);

                        console.log(projectDir);

                        rmdir(projectDir, function(err){
                            if (err) {
                                console.log(err);
                            } else{
                                res.sendStatus(200);
                            };
                        });
                    }
                );
            }
        });

};