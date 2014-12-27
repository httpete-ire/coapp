var User = require('./../../models/user.js');

/**
 * @api {get} /api/users Search users by username
 *
 * @apiName User
 *
 * @apiGroup User
 *
 * @apiParam (Query String) {String} search name of user to search for
 * @apiParam (Query String) {String} ids ids of users to ignore
 * @apiParam (Query String) {boolean} owner ignore logged in user
 *
 * @apiSuccessExample {json} Success-Response:
 *     URL /api/users?search=pe&owner=true
 *
 *     HTTP/1.1 200 OK
 *
 *     [{
 *         "_id": "5489c531dd18360563c13179",
 *         "email": "pete@coapp.com",
 *         "username": "pete"
 *     },{
 *         "_id": "549964b740a64d0000c701a3",
 *         "email": "pearse@coapp.com",
 *         "username": "pearse"
 *     }]
 *
 * @apiError UserNotFound   no user found by the username provided
 *     {
 *         "response": {
 *             "message": "no users found",
 *             "status": 404
 *         }
 *      }
 *
 * @apiPermission User
 *
 * @apiUse NotAuthorized
 */
module.exports =  function(req, res, next) {

    // get query string
    // search database for users
    // excluding users selectd (id)
    // return results

    var name = req.query.search;

    if (!name) {
        return next({
            message: 'you must provide a search term',
            status: 403
        });
    }

    // ids of users to exclude from search
    var ids = [];

    if (req.query.ids) {
        // turn query string into array
        ids = req.query.ids.split(',');
    }

    var includeOwner = (req.query.owner === "true");

    // add the logged in user
    if (!includeOwner) {
        ids.push(req.user._id);
    }

    // search for users whose usernames starts with the search query
    // ignore users with ids
    User.find({
        username: new RegExp('^'+name, "i"),
        _id: { $nin: ids }
    })
    .select('username _id email')
    .exec(function(err, users){
        if (err) {
            return next(err);
        }

        if (!users.length) {
            return next({
                message: 'no users found',
                status: 404
            });
        }

        return res.json(users);
    });

};