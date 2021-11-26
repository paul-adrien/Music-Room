const jwt = require("jsonwebtoken");
const config = require(appRoot + "/config/auth.js");
const db = require(appRoot + "/models");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  console.log(req.headers);

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
  verifyTokenAxios
};
module.exports = authJwt;