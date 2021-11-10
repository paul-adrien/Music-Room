const { authJwt } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/room-controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/room", [authJwt.verifyToken], controller.getAllRoom);
  app.get(
    "/room/:roomName/check-name",
    [authJwt.verifyToken],
    controller.checkName
  );
  app.post("/room", [authJwt.verifyToken], controller.CreateRoom);

  app.get("/room/:roomId", [authJwt.verifyToken], controller.getRoom);
  app.delete("/room/:roomId/user/:userId", [authJwt.verifyToken], controller.delRoom);

  app.post(
    "/room/:roomId/music/:trackId",
    [authJwt.verifyToken],
    controller.addMusicRoom
  );
  app.delete(
    "/room/:roomId/music/:trackId",
    [authJwt.verifyToken],
    controller.delMusicRoom
  );

  app.post(
    "/room/:roomId/invite/:friendId",
    [authJwt.verifyToken],
    controller.inviteToRoom
  );
  app.post(
    "/room/:roomId/acceptInvite",
    [authJwt.verifyToken],
    controller.acceptInviteRoom
  );

  app.post(
    "/room/:roomId/enterRoom",
    [authJwt.verifyToken],
    controller.enterRoom
  );

  app.post(
    "/room/:roomId/progress-track",
    [authJwt.verifyToken],
    controller.stockPositionTrack
  );

  app.delete(
    "/room/:roomId/quitRoom",
    [authJwt.verifyToken],
    controller.quitRoom
  );

  app.post(
    "/room/:roomId/music/:trackId/vote",
    [authJwt.verifyToken],
    controller.voteMusicRoom
  );

  // app.post(
  //   "/room/:roomId/change-type",
  //   [authJwt.verifyToken],
  //   controller.changeType
  // );
};
