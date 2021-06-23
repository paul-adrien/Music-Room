const mongoose = require("mongoose");

const Event = mongoose.model(
    "Event",
    new mongoose.Schema({
        name: String,
        created_by: String,
        status: String,
        start_date: String,
        end_date: String,
        location: {
            lat: Number,
            lng: Number
        },
        type: String,
        vote_right: String,
        style: String,
        users: [{
            id: String,
            username: String,
            right: Boolean
        }],
        musics: [{
            trackId: String,
            duration: String,
            nb_vote: Number,
            vote: [{
                user_id: String
            }]
        }]
    })
);

module.exports = Event;