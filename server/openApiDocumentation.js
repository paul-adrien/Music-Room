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
    "/user/:id/friends": {
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
    "/user/:id/friends/:friendId": {
      delete: {
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
    "/user/:id/friends/:friendId/invite": {
      post: {
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
                  message: "this friend doesn't exist",
                },
              },
            },
          },
        },
      },
    },
    "/user/:id/friends/:friendId/acceptInvite": {
      post: {
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
    "/user/:id/friends/:friendId/refuseInvite": {
      delete: {
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
    "/:userId/playlist": {
      get: {
        tags: ["CRUD operations"],
        description: "get list of playlist public or where user is in playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
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
    "/:userId/playlist/:playlistId": {
      get: {
        tags: ["CRUD operations"],
        description: "get detail of a playlist",
        parameters: [
          {
            name: "x-access-token",
            in: "header",
            required: true,
          },
        ],
        responses: {
          true: {
            description: "New playlist",
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
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
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
    // "/user/authenticate/42": {
    //   get: {
    //     tags: ["CRUD operations"],
    //     description: "login with 42 omniauth",
    //     parameters: [],
    //     responses: {},
    //   },
    // },
    // "/user/authenticate/google": {
    //   get: {
    //     tags: ["CRUD operations"],
    //     description: "login with google omniauth",
    //     parameters: [],
    //     responses: {},
    //   },
    // },
    // "/user/authenticate/github": {
    //   get: {
    //     tags: ["CRUD operations"],
    //     description: "login with github omniauth",
    //     parameters: [],
    //     responses: {},
    //   },
    // },
    // "/user/authenticate/42/callback": {
    //   get: {
    //     tags: ["CRUD operations"],
    //     description: "callback login with 42 omniauth",
    //     parameters: [],
    //     responses: {},
    //   },
    // },
    // "/user/authenticate/google/callback": {
    //   get: {
    //     tags: ["CRUD operations"],
    //     description: "callback login with google omniauth",
    //     parameters: [],
    //     responses: {},
    //   },
    // },
    // "/user/authenticate/github/callback": {
    //   get: {
    //     tags: ["CRUD operations"],
    //     description: "callback login with github omniauth",
    //     parameters: [],
    //     responses: {},
    //   },
    // },
  },
  components: {
    schemas: {
      userName: {
        type: "string",
        example: "paul",
      },
      email: {
        type: "string",
        example: "paul@gmail.com",
      },
      lastName: {
        type: "string",
        example: "laurent",
      },
      firstName: {
        type: "string",
        example: "paul",
      },
      password: {
        type: "string",
        example: "gkjHK56f-hGK",
      },
      comment: {
        type: "string",
        example: "Nice !",
      },
      date: {
        type: "string",
      },
      id: {
        type: "string",
      },
      picture: {
        type: "string",
      },
      userRegsiter: {
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
      userAuthenticate: {
        type: "object",
        properties: {
          userName: {
            $ref: "#/components/schemas/userName",
          },
          password: {
            $ref: "#/components/schemas/password",
          },
        },
      },
      User: {
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
          id: {
            $ref: "#/components/schemas/id",
          },
          rand: {
            type: "number",
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
                      friend: {
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
                      friend: {
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
      Playlist: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          created_by: {
            type: "string",
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
                right: {
                  type: "boolean"
                },
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
            type: "boolean",
          },
          right: {
            type: "boolean",
          },
          style: {
            type: "string",
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
