var path = require("path");
global.appRoot = path.resolve(__dirname);
const http = require("http");
const app = require(appRoot + "/app");
const messaging_controller = require(appRoot +
  "/controllers/messaging-controller");
const room_controller = require(appRoot + "/controllers/room-controller");
const friends_controller = require(appRoot + "/controllers/friends-controller");

const playlist_controller = require(appRoot +
  "/controllers/playlist-controller");
const user_controller = require(appRoot + "/controllers/user-controller");
const music_controller = require(appRoot + "/controllers/music-controller");
const { getUser } = require(appRoot + "/models/lib-user.model");
var datefns = require("date-fns");
const jwt = require("jsonwebtoken");
const config = require(appRoot + "/config/auth.js");
const { logs, authJwt } = require(appRoot + "/middlewares");

app.set("port", 8080);

const server = http.createServer(app);
const options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true,
  },
};
const io = require("socket.io")(server, options);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + 8080;
});

app.get("/explorer_socket", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    if (socket.handshake.query.token === "secret-token") {
      next();
    } else
      jwt.verify(
        socket.handshake.query.token,
        config.secret,
        function (err, decoded) {
          if (err) return next(new Error("Authentication error"));
          socket.decoded = decoded;
          next();
        }
      );
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  //
  socket.on("disconnect", () => {
    //
  });
  // socket.on("test", (data) => {
  //
  //   io.emit("test", data);
  // });

  // USER /////////////////////////////////////////////////////////////////////////////

  socket.on("user edit", (data) => {
    user_controller.userUpdateSocket(data.userId, data.user).then((res) => {
      if (res?.status) {
        logs.logsSOCKS(res.message, res.status, socket.handshake.query.token);
        io.emit(`user update ${data.userId}`, res?.user);
      }
    });
  });

  socket.on("user update type", (data) => {
    user_controller
      .userUpdateAccountSocket(data.userId, data.type)
      .then((res) => {
        if (res?.status) {
          io.emit(`user update ${data.userId}`, res?.user);
        }
      });
  });

  socket.on("user update history", (data) => {
    user_controller
      .userUpdateMusicHistorySocket(data.userId, data.trackId)
      .then((res) => {
        if (res?.status) {
          io.emit(`user update ${data.userId}`, res?.user);
        }
      });
  });

  // FRIEND /////////////////////////////////////////////////////////////////////////////

  socket.on("friend invite", (data) => {
    friends_controller
      .inviteFriendSocket(data.userId, data.friendId)
      .then((res) => {
        if (res.status) {
          return getUser({ id: data.friendId }).then((res) => {
            if (res !== null) {
              logs.logsSOCKS(
                `user update ${data.friendId} invite friend`,
                res.status,
                socket.handshake.query.token
              );
              io.emit(`user update ${data.friendId}`, res);
            } else {
              logs.logsSOCKS(
                "Error when invite in friend",
                res.status,
                socket.handshake.query.token
              );
            }
          });
        } else {
          logs.logsSOCKS(
            "Error when invite in friend",
            res.status,
            socket.handshake.query.token
          );
        }
      });
  });

  socket.on("friend accept invite", (data) => {
    friends_controller
      .acceptInvitationSocket(data.userId, data.friendId)
      .then(async (res) => {
        if (res.status) {
          Promise.all([
            getUser({ id: data.userId }),
            getUser({ id: data.friendId }),
          ]).then(([resUser, resFriend]) => {
            if (resUser !== null && resFriend !== null) {
              logs.logsSOCKS(
                `friend update ${data.friendId} accepte invite`,
                res.status,
                socket.handshake.query.token
              );
              io.emit(`user update ${data.userId}`, resUser);

              io.emit(`user update ${data.friendId}`, resFriend);
            } else {
              logs.logsSOCKS(
                "Error when accepte invite for a friend",
                res.status,
                socket.handshake.query.token
              );
            }
          });
        } else {
          logs.logsSOCKS(
            "Error when accepte invite for a friend",
            res.status,
            socket.handshake.query.token
          );
        }
      });
  });

  socket.on("friend delete", (data) => {
    friends_controller
      .deleteFriendSocket(data.userId, data.friendId)
      .then((res) => {
        if (res.status) {
          Promise.all([
            getUser({ id: data.userId }),
            getUser({ id: data.friendId }),
          ]).then(([resUser, resFriend]) => {
            if (resUser !== null && resFriend !== null) {
              logs.logsSOCKS(
                `friend update ${data.friendId} delete`,
                res.status,
                socket.handshake.query.token
              );
              io.emit(`user update ${data.userId}`, resUser);

              io.emit(`user update ${data.friendId}`, resFriend);
            } else {
              logs.logsSOCKS(
                "Error when delete a friend",
                res.status,
                socket.handshake.query.token
              );
            }
          });
        } else {
          logs.logsSOCKS(
            "Error when delete a friend",
            res.status,
            socket.handshake.query.token
          );
        }
      });
  });

  // CHAT //////////////////////////////////////////////////////////////////////////////

  socket.on("chat message", (data) => {
    messaging_controller
      .sendMessage(data.userId, data.convId, data.message)
      .then((res) => {
        messaging_controller
          .getConversationDetailSocket(data.userId, data.convId)
          .then((res) => {
            if (res.status) {
              logs.logsSOCKS(
                "a message was send",
                res.status,
                socket.handshake.query.token
              );
              let conv = res.conversation;
              conv.messages = res.conversation?.messages?.sort((a, b) => {
                if (datefns.isBefore(new Date(a.date), new Date(b.date))) {
                  return -1;
                } else if (
                  datefns.isAfter(new Date(a.date), new Date(b.date))
                ) {
                  return 1;
                } else {
                  return 0;
                }
              });
              io.emit(`chat message ${data.convId}`, conv);
              res?.conversation?.users?.map((user) => {
                io.emit(`chat convs ${user.userId}`, conv);
              });
            } else {
              logs.logsSOCKS(
                "error when send message: no conversation",
                res.status,
                socket.handshake.query.token
              );
            }
          });
      });
  });

  socket.on("chat create conv", async (data) => {
    messaging_controller
      .createConversationSocket(data.name, data.users)
      .then(async (res) => {
        let conv = await messaging_controller.getConversationByNameSocket(
          data.users[0].userId,
          data.name
        );
        if (res.status) {
          logs.logsSOCKS(
            "a conversation was created",
            res.status,
            socket.handshake.query.token
          );
          data?.users?.map((user) => {
            io.emit(`chat convs ${user.userId}`, conv);
          });
        } else
          logs.logsSOCKS(
            "error when create conversation",
            res.status,
            socket.handshake.query.token
          );
      });
  });

  // ROOM ///////////////////////////////////////////////////////////////////////////////

  socket.on("room create", (data) => {
    room_controller.CreateRoomSocket(data.name, data.userId).then(() =>
      room_controller.getAllRoomSocket().then((res) => {
        if (res.status) {
          logs.logsSOCKS(
            "room create",
            res.status,
            socket.handshake.query.token
          );
          io.emit("room create", res.rooms);
        } else {
          logs.logsSOCKS(
            "Error when create room",
            res.status,
            socket.handshake.query.token
          );
        }
      })
    );
  });

  socket.on("room enter", (data) => {
    room_controller
      .enterRoomSocket(data.userId, data.roomId, data.device)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `room update ${data.roomId} enter room`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`room update ${data.roomId}`, res.room);
          } else {
            logs.logsSOCKS(
              "Error when enter in a room",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("room quit", (data) => {
    room_controller.quitRoomSocket(data.roomId, data.userId).then(() =>
      room_controller.getRoomSocket(data.roomId).then((res) => {
        if (res.status) {
          logs.logsSOCKS(
            `room update ${data.roomId} quit room`,
            res.status,
            socket.handshake.query.token
          );
          io.emit(`room update ${data.roomId}`, res.room);
        } else {
          logs.logsSOCKS(
            "Error when enter in a room",
            res.status,
            socket.handshake.query.token
          );
        }
      })
    );
  });

  socket.on("room add music", (data) => {
    room_controller
      .addMusicRoomSocket(data.roomId, data.userId, data.trackId)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `room update ${data.roomId} add music`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`room update ${data.roomId}`, res.room);
          } else {
            logs.logsSOCKS(
              "Error when create room",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("room del music", (data) => {
    room_controller.delMusicRoomSocket(data.roomId, data.trackId).then(() =>
      room_controller.getRoomSocket(data.roomId).then((res) => {
        if (res.status) {
          logs.logsSOCKS(
            `room update ${data.roomId} del music`,
            res.status,
            socket.handshake.query.token
          );
          io.emit(`room update ${data.roomId}`, res.room);
        } else {
          logs.logsSOCKS(
            "Error when del music in room",
            res.status,
            socket.handshake.query.token
          );
        }
      })
    );
  });

  socket.on("room vote music", (data) => {
    room_controller
      .voteMusicRoomSocket(data.roomId, data.userId, data.trackId)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            io.emit(`room update ${data.roomId}`, res.room);
          } else {
            logs.logsSOCKS(
              "Error when vote for a music in room",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("room invite", (data) => {
    room_controller
      .inviteToRoomSocket(data.roomId, data.userId, data.friendId)
      .then(() =>
        getUser({ id: data.friendId }).then((res) => {
          if (res !== null) {
            logs.logsSOCKS(
              `user update ${data.friendId} invite room`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`user update ${data.friendId}`, res);
          } else {
            logs.logsSOCKS(
              "Error when invite in room",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("room accept invite", (data) => {
    room_controller.acceptInviteRoomSocket(data.userId, data.roomId).then(() =>
      room_controller.getRoomSocket(data.roomId).then(async (res) => {
        if (res.status) {
          logs.logsSOCKS(
            `room update ${data.roomId} accepte invite`,
            res.status,
            socket.handshake.query.token
          );
          const user = await getUser({ id: data.userId });
          if (user) {
            io.emit(`user update ${data.userId}`, user);
          }
          io.emit(`room update ${data.roomId}`, res.room);
        } else {
          logs.logsSOCKS(
            "Error when accepte invite for a room",
            res.status,
            socket.handshake.query.token
          );
        }
      })
    );
  });

  socket.on("room change type", (data) => {
    room_controller
      .changeTypeSocket(data.userId, data.roomId, data.type)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `room update ${data.roomId} change type`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`room update ${data.roomId}`, res.room);
            room_controller.getAllRoomSocket().then((res) => {
              if (res.status) {
                io.emit("room create", res.rooms);
              }
            });
          } else {
            logs.logsSOCKS(
              "Error when change type of a room",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("room change type invited", (data) => {
    room_controller
      .changeTypeInvitedSocket(data.userId, data.roomId, data.type)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `room update ${data.roomId} change type user invited`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`room update ${data.roomId}`, res.room);
          } else {
            logs.logsSOCKS(
              "Error when change type of a user in room",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("room delete", (data) => {
    room_controller.delRoomSocket(data.userId, data.roomId).then(() => {
      io.emit(`room delete ${data.roomId}`);
      room_controller.getAllRoomSocket().then((res) => {
        if (res.status) {
          logs.logsSOCKS(
            "delete room",
            res.status,
            socket.handshake.query.token
          );
          io.emit("room create", res.rooms);
        } else {
          logs.logsSOCKS(
            "Error when delete a room",
            res.status,
            socket.handshake.query.token
          );
        }
      });
    });
  });

  socket.on("add geo/hours limit", (data) => {
    room_controller.addGeoHours(data).then((res) => {
      room_controller.getRoomSocket(data.roomId).then((res) => {
        if (res.status) {
          logs.logsSOCKS(
            `room update ${data.roomId} add deo/hours limit`,
            res.status,
            socket.handshake.query.token
          );
          io.emit(`room update ${data.roomId}`, res.room);
        } else {
          logs.logsSOCKS(
            "Error when add geo/hours limit in room",
            res.status,
            socket.handshake.query.token
          );
        }
      });
    });
  });

  // PLAYLIST ////////////////////////////////////////////////////////////////////

  socket.on("playlist create", (data) => {
    playlist_controller.CreatePlaylistSocket(data.name, data.userId).then(() =>
      playlist_controller.getAllPlaylistSocket().then((res) => {
        if (res.status) {
          logs.logsSOCKS(
            "playlist create",
            res.status,
            socket.handshake.query.token
          );
          io.emit("playlist create", res.playlists);
        } else {
          logs.logsSOCKS(
            "Error when create playlist",
            res.status,
            socket.handshake.query.token
          );
        }
      })
    );
  });

  socket.on("playlist add music", (data) => {
    playlist_controller
      .addMusicPlaylistSocket(data.playlistId, data.userId, data.trackId)
      .then(() =>
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `playlist update ${data.playlistId} add music`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
          } else {
            logs.logsSOCKS(
              "Error when add music in playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("playlist del music", (data) => {
    playlist_controller
      .delMusicPlaylistSocket(data.playlistId, data.trackId)
      .then(() =>
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `playlist update ${data.playlistId} del music`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
          } else {
            logs.logsSOCKS(
              "Error when del music in playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("playlist edit", (data) => {
    playlist_controller
      .editPlaylistSocket(data.playlistId, data.playlistBody)
      .then(() => {
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `playlist update ${data.playlistId} edit`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
          } else {
            logs.logsSOCKS(
              "Error when edit playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        });
      });
  });

  socket.on("playlist invite", (data) => {
    playlist_controller
      .inviteToPlaylistSocket(data.userId, data.playlistId, data.friendId)
      .then(() =>
        getUser({ id: data.friendId }).then((res) => {
          if (res !== null) {
            logs.logsSOCKS(
              `user update ${data.friendId} invite`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`user update ${data.friendId}`, res);
          } else {
            logs.logsSOCKS(
              "Error when invite to playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("playlist accept invite", (data) => {
    playlist_controller
      .acceptInvitePlaylistSocket(data.userId, data.playlistId)
      .then(() =>
        playlist_controller
          .getPlaylistSocket(data.playlistId)
          .then(async (res) => {
            if (res.status) {
              logs.logsSOCKS(
                `playlist update ${data.playlistId} accepte invite`,
                res.status,
                socket.handshake.query.token
              );
              const user = await getUser({ id: data.userId });
              if (user) {
                io.emit(`user update ${data.userId}`, user);
              }
              io.emit(`playlist update ${data.playlistId}`, res.playlist);
            } else {
              logs.logsSOCKS(
                "Error when accepte invite to playlist",
                res.status,
                socket.handshake.query.token
              );
            }
          })
      );
  });

  socket.on("playlist change type", (data) => {
    playlist_controller
      .changeTypeSocket(data.userId, data.playlistId, data.type)
      .then(() =>
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `playlist update ${data.playlistId} change type`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
            playlist_controller.getAllPlaylistSocket().then((res) => {
              if (res.status) {
                io.emit("playlist create", res.playlists);
              }
            });
          } else {
            logs.logsSOCKS(
              "Error when change type of playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("playlist change type invited", (data) => {
    playlist_controller
      .changeTypeInvitedSocket(data.userId, data.playlistId, data.type)
      .then(() =>
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `playlist update ${data.playlistId} change type user invited`,
              res.status,
              socket.handshake.query.token
            );
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
          } else {
            logs.logsSOCKS(
              "Error when change type of a user in playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        })
      );
  });

  socket.on("playlist delete", (data) => {
    playlist_controller
      .delPlaylistSocket(data.userId, data.playlistId)
      .then(() => {
        io.emit(`playlist delete ${data.playlistId}`);
        playlist_controller.getAllPlaylistSocket().then((res) => {
          if (res.status) {
            logs.logsSOCKS(
              `playlist update ${data.playlistId} delete`,
              res.status,
              socket.handshake.query.token
            );
            io.emit("playlist create", res.playlists);
          } else {
            logs.logsSOCKS(
              "Error when delete playlist",
              res.status,
              socket.handshake.query.token
            );
          }
        });
      });
  });

  // DELEGATION ///////////////////////////////////////////////////////////////////////////////

  socket.on("give delegation permission", (data) => {
    if (data?.userId && data?.friendId && data?.userName) {
      music_controller
        .giveDelegationPermission(data.userId, data.friendId)
        .then((res) => {
          if (res) {
            logs.logsSOCKS(
              `${data.friendId} give delegation permission to ${data.friendId}`,
              200,
              socket.handshake.query.token
            );
            io.emit(`give delegation permission to ${data.friendId}`, {
              token: res,
              userId: data.userId,
              userName: data.userName,
            });
          }
        });
    }
  });

  socket.on("action delegation", async (data) => {
    if (data?.userId && data?.action && data?.token && data.friendId) {
      if (
        (await authJwt.verifyDelegationToken(
          data.token,
          data.userId,
          data.friendId
        )) === true
      ) {
        logs.logsSOCKS(
          `${data.userId} send delegation action to ${data.friendId}`,
          200,
          socket.handshake.query.token
        );
        io.emit(`action delegation ${data.friendId}`, {
          userId: data.userId,
          action: data.action,
          trackId: data?.trackId,
          uri: data?.uri,
        });
      }
    }
  });
});

server.listen(8080, () => {});
