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
    }
});

module.exports =  mongoose.model('Project', Project);
