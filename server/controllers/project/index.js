// expose all the project controller funstions
// to the route function
module.exports = {
    getProjects: require('./getProjects.js'),
    newProject: require('./newProject.js'),
    getProject: require('./getProject.js'),
    removeProject: require('./removeProject.js')
}