const mongoose = require("mongoose");

const Conversation = mongoose.model(
    "Conversation",
    new mongoose.Schema({
        name: String,
        last_updated: String,
        users: [{
            name: String,
            userId: String
        }],
        messages: [{
            userId: String,
            message: String,
            date: String
        }]
    })
);

module.exports = Conversation;