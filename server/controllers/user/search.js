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

    User.find({
        username: new RegExp('^'+name, "i")
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