var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

// hashing settings
var GEN_SALT = 10;

var User = new Schema({
    username: {
        type: String
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

User.pre('save', function (next) {
    'use strict';
    var _user = this;

    if(!_user.isModified('password'))  {
       return next();
    }

    // generate salt
    bcrypt.genSalt(GEN_SALT, function(err, salt){
        if(err) {
            return next(err);
        }

        // set users password to hash of password
        bcrypt.hash(_user.password, salt, function(err, hash){
            if(err) {
                return next(err);
            }

            _user.password = hash;
            next();
        });
    });
});

User.methods.comparePasswords = function (password, cb) {
    'use strict';
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

module.exports =  mongoose.model('User', User);
