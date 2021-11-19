const { authJwt } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/user-controller");
const logs = require(appRoot + "/middlewares/logs");
let multer = require("multer");

module.exports = function (app) {
  var upload = multer();
  var type = upload.single("upl");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.use(multer().any());

  app.get("/token", [authJwt.verifyToken], controller.userBoard);
  app.get("/user/:id", [authJwt.verifyToken], controller.getProfile, logs);
  app.get(
    "/user/:id/check-username",
    [authJwt.verifyToken],
    controller.checkUsername,
    logs
  );

  app.get("/user", [authJwt.verifyToken], controller.getSearchProfile, logs);
  app.put("/user/:id", [authJwt.verifyToken], controller.userUpdate, logs);
  app.post(
    "/user/:id/update-picture",
    [authJwt.verifyToken],
    controller.userUpdatePicture,
    logs
  );
  app.post("/user/:id/premium", [authJwt.verifyToken], controller.userUpdateAccount, logs);
};
