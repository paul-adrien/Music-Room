const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./users.model");
db.playlist = require("./playlist.model");
db.event = require("./event.model");
db.room = require("./room.model");

module.exports = db;
