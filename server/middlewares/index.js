const authJwt = require(appRoot + "/middlewares/authJWT");
const verifySignUp = require(appRoot + "/middlewares/verifySignUp");

module.exports = {
  authJwt,
  verifySignUp
};