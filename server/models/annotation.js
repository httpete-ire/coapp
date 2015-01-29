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
    task: {
            type: Schema.Types.ObjectId,
            ref: 'Task'
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
    comments: [{
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
        }
    }],
    type: {
        type: String,
        default: 'everyone'
    },
    priority: {
        type: Boolean,
        default: false
    }
});

module.exports =  mongoose.model('Annotaion', Annotaion);