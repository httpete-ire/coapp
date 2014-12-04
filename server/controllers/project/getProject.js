var Project = require('./../../models/project');

var _ = require('underscore');


module.exports =  function (req, res, next) {

    var projectid = req.params.projectid;

    // get project details based on id

    var query = Project.findOne();

    query
        .where({_id: projectid})
        .populate('owner', '-projects')
        .populate('collaborators', '-projects');

    query.exec(function (err, project) {
        if (err) {
            console.log(err);
        } else{
            res.json(project);
        }
    });
};