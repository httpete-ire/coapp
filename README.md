# [Coapp](http://coapp.me/)

![Coapp](https://httpete.com/images/coapp/main.jpg)

__Coapp__ is a collaboration web app for managing the design stage of projects, the system allows for collaborators to annotate directly on a design. Team members can then have a discussion based on this feedback, and tasks can be assigned to individual team members. Using the task list feature collaborators can view tasks assigned to themselves which are grouped into projects and designs.

__Coapp__ was the main project in third year, and was a collaborative effort by myself and [Joseph O'Reilly](http://josephoreilly.me/). Due to the scale and complexity of the project, development was separated into two streams, the front-end application and a REST API.

We chose to use the __MEAN__ (MongoDB Express Angular Node) stack for development because we both had a good understanding of JavaScript and wanted to expand on this. JavaScript has a single-thread of execution so any I/O operations must be executed asynchronously. Asynchronous code can quickly get out of hand (callback hell) so the Async NPM module was used for handling asynchronous control flow.


### [View application](http://coapp.me/)
