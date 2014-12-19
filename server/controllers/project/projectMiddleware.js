var Project = require('./../../models/project');

module.exports =  function (req, res, next) {
    Project
    .findOne({_id: req.params.projectid})
    .exec(function(err, project){
        if(err) {
            return next(err);
        }

        if(!project) {
            res.status(404).send('no project found');
        } else {
            // project exists so set on req object
            req.project = project;
            // call the next function
            return next();
        }
    });
};