const db = require(appRoot + "/models");
const User = db.user;
const jwt = require("jsonwebtoken");
const config = require(appRoot + "/config/auth.js");


exports.giveDelegationPermission = (userId, friendId) => {
  return new Promise((res, rej) => {
    res(jwt.sign({ id: userId, friendId }, config.secret, {
      expiresIn: 3600, // 1 hours
    }));
  })
};