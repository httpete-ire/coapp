define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login the user into the system",
    "name": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users email address</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Users password</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JSON token</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user",
            "description": "<p>id of the user</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 OK\n    {\n        \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGci\",   // example token\n        \"user\": \"548034cd65fb5600000a352f\"\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidData",
            "description": "<p>Invalid <code>email and/or password</code></p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": \"No user found with that email\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 422 Unproc­essable Entity\n    {\n      \"error\": \"'Invalid email and/or password'\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/auth/login.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "Register the user for the system",
    "name": "Register",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users email address</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Users unique name</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Users password</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": "<p>Confirm password</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 201 Created",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserConflict",
            "description": "<p>The email is already taken</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidData",
            "description": "<p>The data provided was invalid</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 409 Conflict\n    {\n      \"error\": \"'The email is already taken'\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 422 Unproc­essable Entity\n    {\n      \"fieldName\": \"Error for specific field\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/auth/register.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/api/designs/:designid/annotaions",
    "title": "Add new annotaion",
    "name": "Add_annotaion_to_design",
    "group": "Designs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body",
            "description": "<p>Body of message</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "x",
            "description": "<p>x position of message</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "y",
            "description": "<p>y position of message</p> "
          }
        ]
      }
    },
    "permission": [
      {
        "name": "User"
      }
    ],
    "version": "0.0.0",
    "filename": "server/controllers/design/newAnnotation.js",
    "groupTitle": "Designs",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/projects/:projectid/designs",
    "title": "Add design to specific project",
    "name": "Add_new_design",
    "group": "Designs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Design name</p> "
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>Design image</p> "
          }
        ]
      }
    },
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 201 Created",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/design/newDesign.js",
    "groupTitle": "Designs",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidData",
            "description": "<p>The data provided was invalid</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>The <code>id</code> of the Project was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 422 Unproc­essable Entity\n    {\n      \"fieldName\": \"Error for specific field\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": \"No project found with that id\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/designs/:designid",
    "title": "Get single design",
    "name": "Get_single_design",
    "group": "Designs",
    "permission": [
      {
        "name": "User"
      }
    ],
    "version": "0.0.0",
    "filename": "server/controllers/design/getDesign.js",
    "groupTitle": "Designs",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    URL /api/designs/548ef8e922dd71b66e1f8159\n\n    HTTP/1.1 200 OK\n    {\n          \"_id\": \"548ef8e922dd71b66e1f8158\",\n          \"project\": \"548df9fc5eb4153a562e3e00\",\n          \"owner\": \"5489c531dd18360563c13179\",\n          \"name\": \"Home Page\",\n          \"__v\": 0,\n          \"annotaion\": [ ],\n          \"img\": {\n              \"thumbnail\": Path to thumbnail img,\n              \"full\": Path to img\n          },\n          \"created\": \"2014-12-15T15:06:17.520Z\"\n     }",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "optional": false,
            "field": "fields",
            "description": "<p>fields to return                                   (sepearated by a comma)</p> "
          }
        ],
        "Possible Fields": [
          {
            "group": "Possible Fields",
            "type": "Object",
            "optional": false,
            "field": "project",
            "description": "<p>Project that design belongs to</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Object",
            "optional": false,
            "field": "owner",
            "description": "<p>Owner of design</p> "
          },
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of design</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<p>Date design was created</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Object",
            "optional": false,
            "field": "img",
            "description": "<p>Object that contains paths to imgs</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Array",
            "optional": false,
            "field": "annotaion",
            "description": "<p>List of annotaion objects                                     associated with the design</p> "
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/api/projects",
    "title": "Add project",
    "name": "Add_new_project",
    "group": "Projects",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Project name</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Project description</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "collaborators",
            "description": "<p>ID&#39;s of project collaborators                    (seperated by a comma)</p> "
          }
        ]
      }
    },
    "permission": [
      {
        "name": "User"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 201 Created",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Conflict",
            "description": "<p>You can only have one project with the same name</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidData",
            "description": "<p>The data provided was invalid</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 409 Conflict\n    {\n      \"error\": \"'You can only have one project with the same name'\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 422 Unproc­essable Entity\n    {\n      \"fieldName\": \"Error for specific field\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/project/newProject.js",
    "groupTitle": "Projects"
  },
  {
    "type": "delete",
    "url": "/api/projects/:projectid",
    "title": "Delete project",
    "name": "Delete_project",
    "group": "Projects",
    "permission": [
      {
        "name": "User and Owner of project"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    HTTP/1.1 200 Ok",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/controllers/project/removeProject.js",
    "groupTitle": "Projects",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>The <code>id</code> of the Project was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": \"No project found with that id\"\n    }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/projects/:projectid",
    "title": "Get single project",
    "name": "Get_single_project",
    "group": "Projects",
    "permission": [
      {
        "name": "User"
      }
    ],
    "version": "0.0.0",
    "filename": "server/controllers/project/getProject.js",
    "groupTitle": "Projects",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>The <code>id</code> of the Project was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 404 Not Found\n    {\n      \"error\": \"No project found with that id\"\n    }",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "optional": false,
            "field": "fields",
            "description": "<p>fields to return                                   (sepearated by a comma)</p> "
          }
        ],
        "Possible Fields": [
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Projects name</p> "
          },
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Projects descriptiton</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<p>Date project was created</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Date",
            "optional": false,
            "field": "update",
            "description": "<p>Date project was updated</p> "
          },
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "thumbnail",
            "description": "<p>URL of thumbnail image</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Number",
            "optional": false,
            "field": "designCount",
            "description": "<p>Count of design                                                  resources in project</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Object",
            "optional": false,
            "field": "owner",
            "description": "<p>User object that owns the project</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Array",
            "optional": false,
            "field": "collaborators",
            "description": "<p>List of user objects who                                              collaborate on the project</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Array",
            "optional": false,
            "field": "designs",
            "description": "<p>List of design objects                                             associated with the project</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    URL /api/projects?fields=name,desc,thumbnail,collaborators\n\n    HTTP/1.1 200 OK\n     [\n         {\n          \"_id\": \"5489c6736402d7296628ce60\",\n          \"desc\": \"website redesign\",\n          \"name\": \"IADT\",\n          \"collaborators\": [\n              {\n                  \"_id\": \"5489c581dd18360563c1317a\",\n                  \"email\": \"joe@coapp.com\",\n                  \"username\": \"joe\"\n              },\n              {\n                  \"_id\": \"5489c5a5dd18360563c1317b\",\n                  \"email\": \"admin@coapp.com\",\n                  \"username\": \"admin\"\n              },\n              {\n                  \"_id\": \"5489c531dd18360563c13179\",\n                  \"email\": \"pete@coapp.com\",\n                  \"username\": \"pete\"\n              }\n          ],\n          \"thumbnail\": \"http://placehold.it/350X200\"\n          }\n      ]",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/api/projects",
    "title": "Get projects",
    "name": "Get_users_projects",
    "group": "Projects",
    "permission": [
      {
        "name": "User"
      }
    ],
    "version": "0.0.0",
    "filename": "server/controllers/project/getProjects.js",
    "groupTitle": "Projects",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    URL /api/projects?fields=name,desc,thumbnail,collaborators\n\n    HTTP/1.1 200 OK\n     [\n         {\n          \"_id\": \"5489c6736402d7296628ce60\",\n          \"desc\": \"website redesign\",\n          \"name\": \"IADT\",\n          \"collaborators\": [\n              {\n                  \"_id\": \"5489c581dd18360563c1317a\",\n                  \"email\": \"joe@coapp.com\",\n                  \"username\": \"joe\"\n              },\n              {\n                  \"_id\": \"5489c5a5dd18360563c1317b\",\n                  \"email\": \"admin@coapp.com\",\n                  \"username\": \"admin\"\n              },\n              {\n                  \"_id\": \"5489c531dd18360563c13179\",\n                  \"email\": \"pete@coapp.com\",\n                  \"username\": \"pete\"\n              }\n          ],\n          \"thumbnail\": \"http://placehold.it/350X200\"\n          }\n      ]",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Query String": [
          {
            "group": "Query String",
            "type": "String",
            "optional": false,
            "field": "fields",
            "description": "<p>fields to return                                   (sepearated by a comma)</p> "
          }
        ],
        "Possible Fields": [
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Projects name</p> "
          },
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "desc",
            "description": "<p>Projects descriptiton</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<p>Date project was created</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Date",
            "optional": false,
            "field": "update",
            "description": "<p>Date project was updated</p> "
          },
          {
            "group": "Possible Fields",
            "type": "String",
            "optional": false,
            "field": "thumbnail",
            "description": "<p>URL of thumbnail image</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Number",
            "optional": false,
            "field": "designCount",
            "description": "<p>Count of design                                                  resources in project</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Object",
            "optional": false,
            "field": "owner",
            "description": "<p>User object that owns the project</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Array",
            "optional": false,
            "field": "collaborators",
            "description": "<p>List of user objects who                                              collaborate on the project</p> "
          },
          {
            "group": "Possible Fields",
            "type": "Array",
            "optional": false,
            "field": "designs",
            "description": "<p>List of design objects                                             associated with the project</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAuthorized",
            "description": "<p>You must be proved valid authentication details</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "    HTTP/1.1 401 Unauthorized\n    {\n      \"error\": \"You must be authenticated to perform this action\"\n    }",
          "type": "json"
        }
      ]
    }
  }
] });