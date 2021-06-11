const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userName: String,
    email: String,
    lastName: String,
    firstName: String,
    password: String,
    id: String,
    picture: String,
    rand: Number,
    validEmail: Boolean,
    friends: [{ id: String }],
    notifs: {
      playlist: [{
        id: String,
        friend: String,
        right: Boolean,
        date: String
      }],
      friends: [{
        id: String,
        date: String,
      }],
      events: [{
        id: String,
        right: Boolean,
        friend: String,
        date: String
      }]
    }
  })
);

module.exports = User;
