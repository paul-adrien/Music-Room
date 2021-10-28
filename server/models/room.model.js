const mongoose = require("mongoose");

const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    name: String,
    created_by: String,
    invited: [String],
    users: [
      {
        id: String,
        username: String,
        deviceId: String,
      },
    ],
    musics: [
      {
        trackId: String,
        duration: String,
        nb_vote: Number,
        vote: [String],
      },
    ],
    limits: {
      radius: Number,
      center: {
        latitude: Number,
        longitude: Number
      },
      start: String,
      end: String
    },
    type: "public" | "private",
    progress_ms: Number,
  })
);

module.exports = Room;
