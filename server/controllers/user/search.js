var User = require('./../../models/user.js');

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

    // add the logged in user
    ids.push(req.user._id);

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