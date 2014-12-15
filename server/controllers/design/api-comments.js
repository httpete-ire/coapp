
/**
 *
 * @apiDefine DesignDexample
 *
 * @apiSuccessExample {json} Success-Response:
 *     URL /api/designs/548ef8e922dd71b66e1f8159
 *
 *     HTTP/1.1 200 OK
 *     {
 *           "_id": "548ef8e922dd71b66e1f8158",
 *           "project": "548df9fc5eb4153a562e3e00",
 *           "owner": "5489c531dd18360563c13179",
 *           "name": "Home Page",
 *           "__v": 0,
 *           "annotaion": [ ],
 *           "img": {
 *               "thumbnail": Path to thumbnail img,
 *               "full": Path to img
 *           },
 *           "created": "2014-12-15T15:06:17.520Z"
 *      }
 */



/**
 * @apiDefine DesignFields
 *
 * @apiParam (Query String) {String} fields fields to return
 *                                   (sepearated by a comma)
 *
 * @apiParam (Possible Fields) {Object} project Project that design belongs to
 * @apiParam (Possible Fields) {Object} owner Owner of design
 * @apiParam (Possible Fields) {String} name Name of design
 * @apiParam (Possible Fields) {Date} created Date design was created
 * @apiParam (Possible Fields) {Object} img Object that contains paths to imgs
 * @apiParam (Possible Fields) {Array} annotaion List of annotaion objects
 *                                     associated with the design
 *
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
