var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Task = new Schema({
    action: {
        type: String
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedBy: {
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
    isComplete: {
        type: Boolean,
        default: false
    },
    design: {
        type: Schema.Types.ObjectId,
        ref: 'Design'
    },
    annotation: {
        type: {
            type: String
        },
        number: {
            type: Number
        }
    }
});

Task.pre('save', function (next) {
    var task = this;

    var now = Date.now();

    task.updated = now;

    if(!task.created) {
        task.created = now;
    }

    next();
});

module.exports =  mongoose.model('Task', Task);