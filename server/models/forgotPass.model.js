const mongoose = require("mongoose");

const ForgotPass = mongoose.model(
    "ForgotPass",
    new mongoose.Schema({
        email: String,
        rand: Number
    })
);

module.exports = ForgotPass;