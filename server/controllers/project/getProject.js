var Project = require('./../../models/project');

var _ = require('underscore');

/**
 * @api {get} /api/projects/:projectid Get single project
 *
 * @apiName Get single project
 * @apiGroup Projects
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 * @apiUse ProjectFields
 *
 * @apiUse ProjectExample
 *
 * @apiUse ProjectNotFound
 *
 */
module.exports =  function (req, res, next) {

    // get the id from the URL
    var projectid = req.params.projectid;

    // get id
    // build string of fields
    var projectQuery = Project.findOne();

    // select project by id
    projectQuery.where({_id: projectid});

    // use the fields query to select properties to return
    if (!_.isEmpty(req.query) && req.query.fields) {
        // build an array of fields
        var fields = req.query.fields.split(',');

        // join the array to build a string
        projectQuery.select(fields.join(' '));

        // populate collabarorator list
        if(_.contains(fields, 'collaborators')){
            projectQuery.populate('collaborators', 'email username');
        }

        // populate design list
        if(_.contains(fields, 'designs')){
            projectQuery.populate('designs');
        }
    }

    projectQuery.exec(function (err, project) {
        if (err) {
            console.log(err);
        }

        if(!project) {
            res.status(404).send('no project found');
        } else {
            res.status(200).json(project);
        }
    });
};