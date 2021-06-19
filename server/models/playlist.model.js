const mongoose = require("mongoose");

const Playlist = mongoose.model(
    "Playlist",
    new mongoose.Schema({
        name: String,
        created_by: String,
        users: [{
            id: String,
            username: String,
            right: Boolean
        }],
        musics: [{
            trackId: String,
            duration: String
        }],
        type: Boolean,
        right: Boolean,
        style: String
    })
);

module.exports = Playlist;