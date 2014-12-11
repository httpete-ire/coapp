module.exports = {
    getProjects: require('./getProjects.js'),
    newProject: require('./newProject.js'),
    getProject: require('./getProject.js')
}

/**
 *
 * @apiDefine ProjectExample
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
 */

/**
 * @apiDefine ProjectFields
 *
 * @apiParam (Query String) {String} fields fields to return
 *                                   (sepearated by a comma)
 *
 * @apiParam (Possible Fields) {String} name Projects name
 * @apiParam (Possible Fields) {String} desc Projects descriptiton
 * @apiParam (Possible Fields) {Date} created Date project was created
 * @apiParam (Possible Fields) {Date} update Date project was updated
 * @apiParam (Possible Fields) {String} thumbnail URL of thumbnail image
 * @apiParam (Possible Fields) {Number} designCount Count of design
 *                                                  resources in project
 * @apiParam (Possible Fields) {Object} owner User object that owns the project
 * @apiParam (Possible Fields) {Array} collaborators List of user objects who
 *                                              collaborate on the project
 *
 * @apiParam (Possible Fields) {Array} designs List of design objects
 *                                             associated with the project
 */

/**
 * @apiDefine ProjectNotFound
 *
 * @apiError ProjectNotFound The <code>id</code> of the Project was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "No project found with that id"
 *     }
 */
