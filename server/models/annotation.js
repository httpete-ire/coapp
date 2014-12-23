var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Annotaion = new Schema({
    body: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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
        owner: {
            name: {
                type: String
            },
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        },
        created: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports =  mongoose.model('Annotaion', Annotaion);