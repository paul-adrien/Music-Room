const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userName: String,
    email: String,
    lastName: String,
    firstName: String,
    google_account: { id: String, email: String },
    password: String,
    id: String,
    picture:
      {
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        buffer: Buffer,
        size: Number,
      } | String,
    rand: Number,
    validEmail: Boolean,
    friends: [String],
    devices: [{ id: String, name: String, userId: String }],
    application: { model: String, platform: String, version: String },
    musicHistory: [String],
    notifs: {
      playlist: [
        {
          id: String,
          right: Boolean,
          date: String,
          name: String,
        },
      ],
      friends: [
        {
          id: String,
          date: String,
        },
      ],
      rooms: [
        {
          id: String,
          right: Boolean,
          date: String,
          name: String,
        },
      ],
    },
    type: "free" | "premium",
  })
);

module.exports = User;
