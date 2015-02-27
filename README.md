coapp
==============

name of course third year project by Peter Redmond and Joseph O'Reilly.


##prerequisites

the application requires the following dependencies - 

* [node / npm](http://nodejs.org/)

* [mongodb](http://www.mongodb.org/)

* [mochajs](http://mochajs.org/)

* [bower](http://bower.io/)



### to install app

	// from the root directory 
    npm install
    
    // from the public directory 
    bower install
    
    create a mongo database 
    
    change db settings in ./server/config/index.js to path of mongodb
    
    // build the front end dependencies,
    // populate database and compile sass files
    gulp build
    
    // start application
    npm start
    
    
any further questions we can be contacted at <redmondp@gmail.com> or <zebone29@gmail.com>