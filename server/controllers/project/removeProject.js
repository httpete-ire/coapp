var Project = require('./../../models/project');
var User = require('./../../models/user');

/**
 * @api {delete} /api/projects/:projectid Delete project
 *
 * @apiName Delete project
 * @apiGroup Projects
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 * @apiUse ProjectNotFound
 */
module.exports =  function removeProject(req,res,next) {

    // get the id from the URL
    var projectid = req.params.projectid;

    // remove project and if succesful
    // remove project reference from users
    Project.findOneAndRemove({_id: projectid})
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

                            res.send(200);
                        }
                    );
                    // return ok
                    // res.send(200);
                }
            });

};