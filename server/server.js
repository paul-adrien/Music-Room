const http = require("http");
const app = require("./app");
const messaging_controller = require("./controllers/messaging-controller");
const room_controller = require("./controllers/room-controller");

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
});

server.listen(8080, () => {
  console.log(`Server is running on port 8080.`);
});
