var Project = require('./../../models/project');
var User = require('./../../models/user');

var _ = require('underscore');

/**
 * @api {get} /api/projects Get users projects
 *
 * @apiName Get users projects
 * @apiGroup Projects
 *
 * @apiParam (Query String) {String} fields fields to return
 *                                   (sepearated by a comma)
 *
 * @apiParam (Possible Fields) {String} name Projects name
 * @apiParam (Possible Fields) {String} desc Projects descriptiton
 * @apiParam (Possible Fields) {Date} created Date project was created
 * @apiParam (Possible Fields) {Date} update Date project was updated
 * @apiParam (Possible Fields) {String} thumbnail URL of thumbnail image
 * @apiParam (Possible Fields) {Number} designCount Count of designs
 *                                                  resources in project
 * @apiParam (Possible Fields) {Object} owner User object that owns the project
 * @apiParam (Possible Fields) {Array} collaborators List of user objects who
 *                                              collaborate on the project
 *
 * @apiParam (Possible Fields) {Array} designs List of design objects
 *                                             associated with the project
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *     URL /api/projects?fields=name,desc,thumbnail,collaborators
 *
 *     HTTP/1.1 200 OK
 *      [
 *          {
 *           "_id": "5489c6736402d7296628ce60",
 *           "desc": "website redesign",
 *           "name": "IADT",
 *           "collaborators": [
 *               {
 *                   "_id": "5489c581dd18360563c1317a",
 *                   "email": "joe@coapp.com",
 *                   "username": "joe"
 *               },
 *               {
 *                   "_id": "5489c5a5dd18360563c1317b",
 *                   "email": "admin@coapp.com",
 *                   "username": "admin"
 *               },
 *               {
 *                   "_id": "5489c531dd18360563c13179",
 *                   "email": "pete@coapp.com",
 *                   "username": "pete"
 *               }
 *           ],
 *           "thumbnail": "http://placehold.it/350X200"
 *           }
 *       ]
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 *
 */
module.exports =  function (req, res, next) {
    // find the logged in user so project ID's
    // cen be retrieved
    User
    .findOne({_id: req.user._id})
    .exec(function (err, user) {
        if (err) {
            console.log(err);
        } else{

            // get users projects
            var projectIds = user.projects;

            // store DB query
            var query = Project.find();

            if(!_.isEmpty(req.query)) {
                // object of url queries
                var queries = req.query;
            }

            // search projects using the ids of the user
            query.where({_id: {
                $in: projectIds
            }});

            // if the query string join to create a string
            if (queries && queries.fields) {

                // build an array of fields
                var fields = queries.fields.split(',');

                // join the array to build a string
                query.select(fields.join(' '));

                // populate user objects on database
                if(_.contains(fields, 'collaborators')){
                    query.populate('collaborators', 'email username');
                }
            }

            // execute query
            query.exec(function(err, projects) {
                if (err) {
                    console.log(err);
                } else{
                    res.json(projects);
                }
            });
        }
    });
};