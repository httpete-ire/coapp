var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Design = new Schema({
    name: {
        type: String,
        index: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    img: {
        full: {
            type: String
        },
        thumbnail: {
            type: String
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    annotaion: [{
        type: Schema.Types.ObjectId,
        ref: 'Annotaion'
    }]     // annotaion sub document
});

module.exports =  mongoose.model('Design', Design);