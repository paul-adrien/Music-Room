const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require(appRoot + "/models/users.model");
db.playlist = require(appRoot + "/models/playlist.model");
db.event = require(appRoot + "/models/event.model");
db.room = require(appRoot + "/models/room.model");
db.conversation = require(appRoot + "/models/messaging.model");
db.forgotPass = require(appRoot + "/models/forgotPass.model");

module.exports = db;
