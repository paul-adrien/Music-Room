const { authJwt } = require("../middlewares");
const controller = require("../controllers/room-controller");

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
  app.delete("/room/:roomId", [authJwt.verifyToken], controller.delRoom);

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
  // app.put("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.chageOrderPlaylist);

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
  app.delete(
    "/:userId/playlist/:playlistId/refuseInvite",
    [authJwt.verifyToken],
    controller.refuseInviteToPlaylist
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

  //app.put("/:userId/playlist/:playlistId/friends/:friendId", [authJwt.verifyToken], controller.editUserPlaylist)
};
