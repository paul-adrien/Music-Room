const mongoose = require("mongoose");

const Token = mongoose.model(
  "Token",
  new mongoose.Schema({
    token: String,
    userId: String,
    date: String
  })
);

module.exports = Token;
