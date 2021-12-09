const { verifySignUp } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/auth-controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Origin", "*");

    next();
  });

  app.post(
    "/user/register",
    verifySignUp.checkDuplicateUsernameOrEmail,
    controller.signup
  );
  app.post("/user/authenticate", controller.signin);
  // app.put("/user/application/test/test/test/test", controller.stockAppInfo);
};
