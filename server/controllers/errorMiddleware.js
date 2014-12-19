/**
 * middleware to send error messages to user
 * @param  {Object}   err  :: error object
 * @param  {Object}   req  :: request object
 * @param  {Object}   res  :: response object
 * @param  {Function} next :: next middleware function
 * @return {Obejct} :: object containing error message and status
 */
module.exports =  function (err, req, res, next) {

    var message = err.message;
    var error = err.error || err;
    var status = err.status || 500;

    // return status
    res.json({
         error: error
     }, status);
};