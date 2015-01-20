var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
    name: {
        type: String,
        index: true
    },
    desc: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    thumbnail: {
        type: String,
        default: 'http://placehold.it/350X200'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    collaborators : [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    designs: [{
        type: Schema.Types.ObjectId,
        ref: 'Design'
    }],
    designCount: {
        type: Number,
        default:0
    },
    recentActivities: [{

        activityType: {
            type: String
        },
        completedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        completedDate: {
            type: Date,
            default: Date.now
        },
        design: {
            type: Schema.Types.ObjectId,
            ref: 'Design'
        }
    }]
});

Project.pre('save', function (next) {
    var project = this;

    var now = Date.now();

    project.updated = now;

    if(!project.created) {
        project.created = now;
    }

    next();
});

module.exports =  mongoose.model('Project', Project);
