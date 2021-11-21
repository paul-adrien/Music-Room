const { authJwt, logs } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/room-controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/room", [authJwt.verifyToken], controller.getAllRoom, logs.logsHTTP);
  app.get(
    "/room/:roomName/check-name",
    [authJwt.verifyToken],
    controller.checkName, logs.logsHTTP
  );
  app.post("/room", [authJwt.verifyToken], controller.CreateRoom, logs.logsHTTP);

  app.get("/room/:roomId", [authJwt.verifyToken], controller.getRoom, logs.logsHTTP);
  app.delete(
    "/room/:roomId/user/:userId",
    [authJwt.verifyToken],
    controller.delRoom, logs.logsHTTP
  );

  app.post(
    "/room/:roomId/music/:trackId",
    [authJwt.verifyToken],
    controller.addMusicRoom, logs.logsHTTP
  );
  app.delete(
    "/room/:roomId/music/:trackId",
    [authJwt.verifyToken],
    controller.delMusicRoom, logs.logsHTTP
  );

  app.post(
    "/room/:roomId/invite/:friendId",
    [authJwt.verifyToken],
    controller.inviteToRoom, logs.logsHTTP
  );
  app.post(
    "/room/:roomId/acceptInvite",
    [authJwt.verifyToken],
    controller.acceptInviteRoom, logs.logsHTTP
  );

  app.post(
    "/room/:roomId/enterRoom",
    [authJwt.verifyToken],
    controller.enterRoom, logs.logsHTTP
  );

  app.post(
    "/room/:roomId/progress-track",
    [authJwt.verifyToken],
    controller.stockPositionTrack, logs.logsHTTP
  );

  app.delete(
    "/room/:roomId/quitRoom",
    [authJwt.verifyToken],
    controller.quitRoom, logs.logsHTTP
  );

  app.post(
    "/room/:roomId/music/:trackId/vote",
    [authJwt.verifyToken],
    controller.voteMusicRoom, logs.logsHTTP
  );

  app.get(
    "/room/:roomId/check-limit",
    [authJwt.verifyToken],
    controller.checkLimitRoom, logs.logsHTTP
  );

  // app.post(
  //   "/room/:roomId/change-type",
  //   [authJwt.verifyToken],
  //   controller.changeType
  // );
};
