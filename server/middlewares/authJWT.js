const jwt = require("jsonwebtoken");
const config = require(appRoot + "/config/auth.js");
const db = require(appRoot + "/models");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.json({
      status: false,
      message: "No token"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.json({
        status: false,
        message: "unauthorized !"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

verifyDelegationToken = (token, userId, friendId) => {
  return new Promise((res, rej) => {
    if (!token) {
      rej(false);
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          rej(false);
        } else if (decoded.id === friendId && decoded.friendId === userId) {
          res(true);
        } else
          rej(false);
      });
    }
  })
};

verifyTokenAxios = (req, res, next) => {
  let token = req.query.token;

  if (!token) {
    return res.json({
      status: false,
      message: "No token"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.json({
        status: false,
        message: "unauthorized !"
      });
    }
    next();
  });
};

const authJwt = {
  verifyToken,
  verifyTokenAxios,
  verifyDelegationToken
};
module.exports = authJwt;