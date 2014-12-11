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
            "field": "password",
            "description": "<p>Users password</p> "
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
    "url": "/api/projects",
    "title": "Add a new project resource",
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
  }
] });