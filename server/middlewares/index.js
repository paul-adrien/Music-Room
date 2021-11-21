const authJwt = require(appRoot + "/middlewares/authJWT");
const verifySignUp = require(appRoot + "/middlewares/verifySignUp");
const logs = require(appRoot + "/middlewares/logs");

module.exports = {
  authJwt,
  verifySignUp,
  logs
};