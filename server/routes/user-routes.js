const { authJwt } = require("../middlewares");
const controller = require("../controllers/user-controller");
const logs = require("../middlewares/logs");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/token", [authJwt.verifyToken], controller.userBoard);
  app.get("/user/:id", [authJwt.verifyToken], controller.getProfile, logs);
  app.get("/user", [authJwt.verifyToken], controller.getSearchProfile, logs);
  app.put("/user/:id", [authJwt.verifyToken], controller.userUpdate, logs);
};
