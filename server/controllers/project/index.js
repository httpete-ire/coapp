// expose all the project controller funstions
// to the route handler
module.exports = {
    getProjects: require('./projects/read.js'),
    create: require('./create.js'),
    read: require('./read.js'),
    delete: require('./delete.js'),
    middleware: require('./middleware.js'),
    update: require('./update.js')
}