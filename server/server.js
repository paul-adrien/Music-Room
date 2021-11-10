var path = require('path');
global.appRoot = path.resolve(__dirname);
const http = require("http");
const app = require(appRoot + "/app");
const messaging_controller = require(appRoot + "/controllers/messaging-controller");
const room_controller = require(appRoot + "/controllers/room-controller");
const playlist_controller = require(appRoot + "/controllers/playlist-controller");
const user_controller = require(appRoot + "/controllers/user-controller");
const { getUser } = require(appRoot + "/models/lib-user.model");

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
  console.log("Listening on " + bind);
});

app.get("/explorer_socket", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // USER /////////////////////////////////////////////////////////////////////////////

  socket.on("user edit", (data) => {
    console.log(data);
    user_controller.userUpdateSocket(data.userId, data.user).then((res) => {
      console.log(res);
      if (res?.status) {
        io.emit(`user update ${data.userId}`, res?.user);
      }
    });
  });

  // CHAT //////////////////////////////////////////////////////////////////////////////

  socket.on("chat message", (data) => {
    console.log(data);
    messaging_controller
      .sendMessage(data.userId, data.convId, data.message)
      .then((res) =>
        messaging_controller.getConversationDetailSocket(
          data.userId,
          data.convId
        )
      )
      .then((res) => {
        if (res.status) {
          io.emit(`chat message ${data.convId}`, data.message);
          res?.conversation?.users?.map((user) => {
            io.emit(`chat convs ${user.userId}`, res.conversation);
          });
        }
      });
  });

  socket.on("chat create conv", async (data) => {
    console.log(data);
    messaging_controller
      .createConversationSocket(data.name, data.users)
      .then(async (res) => {
        let conv = await messaging_controller.getConversationByNameSocket(
          data.users[0].userId,
          data.name
        );
        console.log(conv);
        if (res.status) {
          data?.users?.map((user) => {
            io.emit(`chat convs ${user.userId}`, conv);
          });
        }
      });
  });

  // ROOM ///////////////////////////////////////////////////////////////////////////////

  socket.on("room create", (data) => {
    room_controller.CreateRoomSocket(data.name, data.userId).then(() =>
      room_controller.getAllRoomSocket().then((res) => {
        if (res.status) {
          io.emit("room create", res.rooms);
        }
      })
    );
  });

  socket.on("room enter", (data) => {
    room_controller
      .enterRoomSocket(data.userId, data.roomId, data.deviceId)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            io.emit(`room update ${data.roomId}`, res.room);
          }
        })
      );
  });

  socket.on("room add music", (data) => {
    console.log(io);
    room_controller
      .addMusicRoomSocket(data.roomId, data.userId, data.trackId)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          if (res.status) {
            io.emit(`room update ${data.roomId}`, res.room);
          }
        })
      );
  });

  socket.on("room del music", (data) => {
    room_controller.delMusicRoomSocket(data.roomId, data.trackId).then(() =>
      room_controller.getRoomSocket(data.roomId).then((res) => {
        if (res.status) {
          io.emit(`room update ${data.roomId}`, res.room);
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
            io.emit(`user update ${data.friendId}`, res);
          }
        })
      );
  });

  socket.on("room accept invite", (data) => {
    room_controller.acceptInviteRoomSocket(data.userId, data.roomId).then(() =>
      room_controller.getRoomSocket(data.roomId).then((res) => {
        if (res.status) {
          io.emit(`room update ${data.roomId}`, res.room);
        }
      })
    );
  });

  socket.on("room change type", (data) => {
    room_controller
      .changeTypeSocket(data.userId, data.roomId, data.type)
      .then(() =>
        room_controller.getRoomSocket(data.roomId).then((res) => {
          console.log(res)
          if (res.status) {
            io.emit(`room update ${data.roomId}`, res.room);
            room_controller.getAllRoomSocket().then((res) => {
              if (res.status) {
                io.emit("room create", res.rooms);
              }
            })
          }
        })
      );
  });

  socket.on("room delete", (data) => {
    room_controller
      .delRoomSocket(data.userId, data.roomId)
      .then(() => {
        io.emit(`room delete ${data.roomId}`);
        room_controller.getAllRoomSocket().then((res) => {
          if (res.status) {
            io.emit("room create", res.rooms);
          }
        })
      });
  });

  // PLAYLIST ////////////////////////////////////////////////////////////////////

  socket.on("playlist create", (data) => {
    playlist_controller.CreatePlaylistSocket(data.name, data.userId).then(() =>
      playlist_controller.getAllPlaylistSocket().then((res) => {
        if (res.status) {
          io.emit("playlist create", res.playlists);
        }
      })
    );
  });

  socket.on("playlist add music", (data) => {
    console.log(io);
    playlist_controller
      .addMusicPlaylistSocket(data.playlistId, data.userId, data.trackId)
      .then(() =>
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
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
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
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
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
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
            io.emit(`user update ${data.friendId}`, res);
          }
        })
      );
  });

  socket.on("playlist accept invite", (data) => {
    playlist_controller
      .acceptInvitePlaylistSocket(data.userId, data.playlistId)
      .then(() =>
        playlist_controller.getPlaylistSocket(data.playlistId).then((res) => {
          if (res.status) {
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
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
            io.emit(`playlist update ${data.playlistId}`, res.playlist);
            playlist_controller.getAllPlaylistSocket().then((res) => {
              if (res.status) {
                io.emit("playlist create", res.playlists);
              }
            })
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
            io.emit("playlist create", res.playlists);
          }
        })
      });
  });
});

server.listen(8080, () => {
  console.log(`Server is running on port 8080.`);
});
