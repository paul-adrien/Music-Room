module.exports = {
  openapi: "3.0.3",
  info: {
    version: "1",
    title: "music-room API",
    description: "",
    contact: {
      name: "Gguyot & Plaurent",
      email: "paul.adrien.76@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:8080/",
      description: "Local server",
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  tags: [
    {
      name: "CRUD operations",
    },
  ],
  paths: {
    "/user/register": {
      post: {
        tags: ["CRUD operations"],
        description: "Create user",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userRegsiter",
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "User was registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message:
                    "No token || unauthorized || Failed! Username is already in use! || Failed! Email is already in use! ",
                },
              },
            },
          },
        },
      },
    },
    "/user/authenticate": {
      post: {
        tags: ["CRUD operations"],
        description: "login",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/userAuthenticate",
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "User was registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                  message: "sdfdsf",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message:
                    "No token || unauthorized || Invalid Password! || User Not found.",
                },
              },
            },
          },
        },
      },
    },
    "/user/authenticate/42": {
      get: {
        tags: ["CRUD operations"],
        description: "login with 42 omniauth",
        parameters: [],
        responses: {},
      },
    },
    "/user/authenticate/google": {
      get: {
        tags: ["CRUD operations"],
        description: "login with google omniauth",
        parameters: [],
        responses: {},
      },
    },
    "/user/authenticate/github": {
      get: {
        tags: ["CRUD operations"],
        description: "login with github omniauth",
        parameters: [],
        responses: {},
      },
    },
    "/user/authenticate/42/callback": {
      get: {
        tags: ["CRUD operations"],
        description: "callback login with 42 omniauth",
        parameters: [],
        responses: {},
      },
    },
    "/user/authenticate/google/callback": {
      get: {
        tags: ["CRUD operations"],
        description: "callback login with google omniauth",
        parameters: [],
        responses: {},
      },
    },
    "/user/authenticate/github/callback": {
      get: {
        tags: ["CRUD operations"],
        description: "callback login with github omniauth",
        parameters: [],
        responses: {},
      },
    },
    "/token": {
      get: {
        tags: ["CRUD operations"],
        description: "Check token",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Users exist and send",
            content: {
              "application/json": {
                example: {
                  message: "user was log",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "No token || unauthorized || user doesn't exist ",
                },
              },
            },
          },
        },
      },
    },
    "/user": {
      get: {
        tags: ["CRUD operations"],
        description: "Search profiles",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "search",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          }
        ],
        responses: {
          true: {
            description: "users profile",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: 'object',
                    properties: {
                      users: {
                        $ref: "#/components/schemas/User",
                      },
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist || this user doesn't exist",
                },
              },
            },
          },
        },
      },
    },
    "/user/:id": {
      get: {
        tags: ["CRUD operations"],
        description: "Get user information",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "user_id",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Users exist and send",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "No token || unauthorized || user doesn't exist ",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["CRUD operations"],
        description: "Get user information",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "user_id",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userName: {
                    $ref: "#/components/schemas/userName",
                  },
                  email: {
                    $ref: "#/components/schemas/email",
                  },
                  lastName: {
                    $ref: "#/components/schemas/lastName",
                  },
                  firstName: {
                    $ref: "#/components/schemas/firstName",
                  },
                  password: {
                    $ref: "#/components/schemas/password",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "User update",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userName: {
                      $ref: "#/components/schemas/userName",
                    },
                    email: {
                      $ref: "#/components/schemas/email",
                    },
                    lastName: {
                      $ref: "#/components/schemas/lastName",
                    },
                    firstName: {
                      $ref: "#/components/schemas/firstName",
                    },
                    password: {
                      $ref: "#/components/schemas/password",
                    },
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "No token || unauthorized || user update error",
                },
              },
            },
          },
        },
      },
    },
    "/user/:Id/update-picture": {
      get: {
        tags: ["CRUD operations"],
        description: "Update user picture",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "id",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "picture",
            in: "files",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "user updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist || this user doesn't exist",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/friends": {
      get: {
        tags: ["CRUD operations"],
        description: "Get friend list",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Friends list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/friendsList",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist || this user doesn't exist",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/friends/:friendId": {
      delete: {
        tags: ["CRUD operations"],
        description: "delete friend",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "friendId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Friend delete",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist || this user is not your friend",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/friends/:friendId/invite": {
      post: {
        tags: ["CRUD operations"],
        description: "Invite a user to become your friend",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "friendId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          }
        ],
        responses: {
          true: {
            description: "Friends invite",
            content: {
              "application/json": {
                example: {
                  message: "invitation was send",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist || this friend doesn't exist || already sending invite || this user already invite you",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/friends/:friendId/acceptInvite": {
      post: {
        tags: ["CRUD operations"],
        description: "accepte friend invitation ",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "friendId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Accept friends invite",
            content: {
              "application/json": {
                example: {
                  message: "you have a new friend !",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/friends/:friendId/refuseInvite": {
      delete: {
        tags: ["CRUD operations"],
        description: "refuse invitation",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "friendId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Friends invite",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this friend doesn't exist",
                },
              },
            },
          },
        },
      },
    },
    "/playlist": {
      get: {
        tags: ["CRUD operations"],
        description: "get list of playlist public or where user is in playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "List of playlist created by you",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    playlist: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Playlist"
                      }
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["CRUD operations"],
        description: "create a new playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  userId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "List of playlist",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    playlist: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Playlist"
                      }
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "error",
                },
              },
            },
          },
        },
      },
    },
    "/playlist/:playlistId": {
      get: {
        tags: ["CRUD operations"],
        description: "get detail of a playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "playlistId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Details of playlist",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    playlist: {
                      $ref: "#/components/schemas/Playlist"
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["CRUD operations"],
        description: "edit playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "playlistId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                  },
                  right: {
                    type: "string",
                  },
                  style: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "edited playlist",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    playlist: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Playlist"
                      }
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "error",
                },
              },
            },
          },
        },
      },
    },
    "/playlist/:playlistId/:userId": {
      delete: {
        tags: ["CRUD operations"],
        description: "Delete a playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "playlist was delete",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this playlist doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/playlist/:playlistId/music/:trackId": {
      post: {
        tags: ["CRUD operations"],
        description: "Add music to a playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "trackId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "playlistId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  trackId: {
                    type: "string",
                  },
                  duration: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "music add to the list",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this playlist doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["CRUD operations"],
        description: "Delete music to a playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "trackId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "playlistId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "music remove to the list",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this playlist doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/playlist/:playlistId/invite/:friendId": {
      post: {
        tags: ["CRUD operations"],
        description: "invite friend to a playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "friendId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "playlistId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "invite send",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this playlist doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
      "/playlist/:playlistId/acceptInvite": {
        post: {
          tags: ["CRUD operations"],
          description: "accept invite to join a playlist",
          parameters: [
            {
              name: "x-access-token",
              in: "header",
              required: true,
            },
            {
              name: "playlistId",
              in: "params",
              schema: {
                type: "string",
              },
              required: true,
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    userId: {
                      type: "string",
                    }
                  },
                },
              },
            },
            required: true,
          },
          responses: {
            true: {
              description: "",
              content: {
                "application/json": {
                  example: {
                    message: "invite send",
                  },
                },
              },
            },
            false: {
              description: "Missing parameters",
              content: {
                "application/json": {
                  example: {
                    message: "this playlist doesn't exist or you dont have the good right",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/room": {
      get: {
        tags: ["CRUD operations"],
        description: "get all rooms",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "List of rooms",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    playlist: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Room"
                      }
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["CRUD operations"],
        description: "create a new room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  userId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "new room",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    playlist: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Playlist"
                      }
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "error",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId": {
      get: {
        tags: ["CRUD operations"],
        description: "get detail of a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "Details of room",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                    room: {
                      $ref: "#/components/schemas/Room"
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomName/check-name": {
      delete: {
        tags: ["CRUD operations"],
        description: "Delete a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomName",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                  userId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "room change type",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/user/:userId": {
      delete: {
        tags: ["CRUD operations"],
        description: "Delete a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "room was delete",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/music/:trackId": {
      post: {
        tags: ["CRUD operations"],
        description: "Add music to a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "trackId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  trackId: {
                    type: "string",
                  },
                  duration: {
                    type: "string",
                  },
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "music add to the list",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["CRUD operations"],
        description: "Delete music to a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "trackId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "music remove to the list",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/invite/:friendId": {
      post: {
        tags: ["CRUD operations"],
        description: "invite friend to a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "friendId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "invite send",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/acceptInvite": {
      post: {
        tags: ["CRUD operations"],
        description: "accept invite to join a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "invite send",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/enterRoom": {
      post: {
        tags: ["CRUD operations"],
        description: "join a room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: {
                    type: "string",
                  },
                  deviceId: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "you have enter this room",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "this room doesn't exist or you dont have the good right",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/progress-track": {
      post: {
        tags: ["CRUD operations"],
        description: "stock position track",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  progress_ms: {
                    type: "string",
                  }
                },
              },
            },
          },
          required: true,
        },
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "you have stock the track's position in this room",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/quitRoom": {
      delete: {
        tags: ["CRUD operations"],
        description: "leave room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "userId",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "you have stock the track's position in this room",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
    },
    "/room/:roomId/music/:trackId/vote": {
      post: {
        tags: ["CRUD operations"],
        description: "leave room",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "roomId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "trackId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "userId",
            in: "query",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                example: {
                  message: "this music is vote",
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/conversation": {
      get: {
        tags: ["CRUD operations"],
        description: "Conservation list",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: 'object',
                    properties: {
                      conversation: {
                        $ref: "#/components/schemas/Conversation",
                      },
                    }
                  },
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
    },
    "/user/:userId/conversation/:conversationId": {
      get: {
        tags: ["CRUD operations"],
        description: "Conservation detail",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
          {
            name: "userId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
          {
            name: "conversationId",
            in: "params",
            schema: {
              type: "string",
            },
            required: true,
          },
        ],
        responses: {
          true: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: 'object',
                  properties: {
                    conversation: {
                      $ref: "#/components/schemas/Conversation",
                    },
                  }
                },
              },
            },
          },
          false: {
            description: "Missing parameters",
            content: {
              "application/json": {
                example: {
                  message: "",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      userRegsiter: {
        type: "object",
        properties: {
          userName: {
            type: "string",
          },
          email: {
            type: "string",
          },
          lastName: {
            type: "string",
          },
          firstName: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
      },
      userAuthenticate: {
        type: "object",
        properties: {
          userName: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          userName: {
            type: "string",
          },
          email: {
            type: "string",
          },
          lastName: {
            type: "string",
          },
          firstName: {
            type: "string",
          },
          password: {
            type: "string",
          },
          id: {
            type: "string",
          },
          rand: {
            type: "number",
          },
          picture: {
            type: "object",
          },
          validEmail: {
            type: "boolean",
          },
          friends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                }
              }
            },
          },
          notifs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                playlist: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string"
                      },
                      name: {
                        type: "string"
                      },
                      right: {
                        type: "boolean"
                      },
                      date: {
                        type: "string"
                      }
                    }
                  }
                },
                friends: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string"
                      },
                      date: {
                        type: "string"
                      }
                    }
                  }
                },
                events: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string"
                      },
                      name: {
                        type: "string"
                      },
                      right: {
                        type: "boolean"
                      },
                      date: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            },
          },
        },
      },
      Playlist: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          created_by: {
            type: "string",
          },
          invited: {
            type: "array",
            items: {
              type: "string"
            },
          },
          users: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                },
                username: {
                  type: "string"
                }
              }
            },
          },
          musics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                trackId: {
                  type: "string"
                },
                duration: {
                  type: "string"
                },
              }
            },
          },
          type: {
            type: "string",
          },
        },
      },
      Room: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          created_by: {
            type: "string",
          },
          invited: {
            type: "array",
            items: {
              type: "string"
            },
          },
          users: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string"
                },
                username: {
                  type: "string"
                },
                deviceId: {
                  type: "string"
                }
              }
            },
          },
          musics: {
            type: "array",
            items: {
              type: "object",
              properties: {
                trackId: {
                  type: "string"
                },
                duration: {
                  type: "string"
                },
              }
            },
          },
          type: {
            type: "string",
          },
          progress_ms: {
            type: "number",
          },
        },
      },
      friendsList: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            userName: {
              type: "string",
            }
          }
        },
      },
      Conversation: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          last_updated: {
            type: "string",
          },
          invited: {
            type: "array",
            items: {
              type: "string"
            },
          },
          users: {
            type: "array",
            items: {
              type: "object",
              properties: {
                userId: {
                  type: "string"
                },
                name: {
                  type: "string"
                },
              }
            },
          },
          messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                userId: {
                  type: "string"
                },
                message: {
                  type: "string"
                },
                date: {
                  type: "string"
                },
              }
            },
          },
        },
      },
    },
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-access-token",
      },
    },
  },
};