// expose all the project controller funstions
// to the route handler
module.exports = {
    getProjects: require('./getProjects.js'),
    newProject: require('./newProject.js'),
    getProject: require('./getProject.js'),
    removeProject: require('./removeProject.js'),
    middleware: require('./projectMiddleware.js'),
    updateProject: require('./updateProject.js')
}