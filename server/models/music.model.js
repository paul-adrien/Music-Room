const mongoose = require("mongoose");

const Music = mongoose.model(
  "Music",
  new mongoose.Schema({
    trackId: String,
    duration: String
  })
);

module.exports = { Music };