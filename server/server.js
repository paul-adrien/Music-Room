const http = require("http");
const app = require("./app");
const messaging_controller = require("./controllers/messaging-controller");
const room_controller = require("./controllers/room-controller");
const playlist_controller = require("./controllers/playlist-controller");

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

app.get("/test-socket", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (data) => {
    console.log(data);
    messaging_controller.sendMessage(data.userId, data.convId, data.message);
    io.emit("chat message", data.message);
  });

  socket.on("room create", (data) => {
    room_controller.CreateRoomSocket(data.name, data.userId).then(() =>
      room_controller.getAllRoomSocket().then((res) => {
        if (res.status) {
          io.emit("room create", res.rooms);
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
});

server.listen(8080, () => {
  console.log(`Server is running on port 8080.`);
});
