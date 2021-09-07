const mongoose = require("mongoose");

const Playlist = mongoose.model(
  "Playlist",
  new mongoose.Schema({
    name: String,
    created_by: String,
    invited: [String],
    users: [
      {
        id: String,
        username: String,
      },
    ],
    musics: [
      {
        trackId: String,
        duration: String,
      },
    ],
    type: "public" | "private",
  })
);

module.exports = Playlist;
