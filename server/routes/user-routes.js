const { authJwt, logs } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/user-controller");
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
  app.post("/forgotPass", controller.forgotPass_send);
  app.put("/changePass", controller.forgotPass_check);
  app.get(
    "/user/:id",
    [authJwt.verifyToken],
    controller.getProfile,
    logs.logsHTTP
  );
  app.delete(
    "/user/:id",
    [authJwt.verifyToken],
    controller.deleteUser,
    logs.logsHTTP
  );
  app.get(
    "/user/:id/check-username",
    [authJwt.verifyToken],
    controller.checkUsername,
    logs.logsHTTP
  );

  app.get(
    "/user",
    [authJwt.verifyToken],
    controller.getSearchProfile,
    logs.logsHTTP
  );
  app.put(
    "/user/:id",
    [authJwt.verifyToken],
    controller.userUpdate,
    logs.logsHTTP
  );
  app.post(
    "/user/:id/update-picture",
    [authJwt.verifyToken],
    controller.userUpdatePicture,
    logs.logsHTTP
  );
  app.post(
    "/user/:id/premium",
    [authJwt.verifyToken],
    controller.userUpdateAccount,
    logs.logsHTTP
  );
  app.post("/verify-email", controller.sendVerifyEmail);
  app.get("/verify/:rand/email/:email", controller.verifyEmail);
};
