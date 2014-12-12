var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Annotaion = new Schema({
    body: {
        type: String
    },
     created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    isTask: {
        type: Boolean
    },
    circle: {
        x: {
            type: Number
        },
        y: {
            type: Number
        },
        color: {
            type: String,
            default: '#8e44ad'
        }
    },
    messages: [{
        body: {
            type: String
        },
        username: {
            type: String
        }
    }]
});

module.exports =  mongoose.model('Annotaion', Annotaion);