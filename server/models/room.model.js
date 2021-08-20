const mongoose = require("mongoose");

const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    name: String,
    created_by: String,
    users: [
      {
        id: String,
        username: String,
        right: Boolean,
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
    type: Boolean,
    right: Boolean,
    style: String,
  })
);

module.exports = Room;
