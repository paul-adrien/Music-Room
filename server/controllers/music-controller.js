const db = require(appRoot + "/models");
const User = db.user;
const jwt = require("jsonwebtoken");
const config = require(appRoot + "/config/auth.js");


exports.giveDelegationPermission = (userId) => {
  return (token = jwt.sign({ id: userId }, config.secret, {
    expiresIn: 3600, // 24 hours
  }));
};