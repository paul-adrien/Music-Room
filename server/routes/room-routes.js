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
  app.post("/room", [authJwt.verifyToken], controller.CreateRoom);

  app.get("/room/:roomId", [authJwt.verifyToken], controller.getRoom);
  app.delete("/room/:roomId", [authJwt.verifyToken], controller.delRoom);
  app.put("/room/:roomId", [authJwt.verifyToken], controller.editRoom);

  app.post(
    "/:userId/playlist/:playlistId/music/:trackId",
    [authJwt.verifyToken],
    controller.addMusicPlaylist
  );
  app.delete(
    "/:userId/playlist/:playlistId/music/:trackId",
    [authJwt.verifyToken],
    controller.delMusicPlaylist
  );
  // app.put("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.chageOrderPlaylist);

  app.post(
    "/:userId/playlist/:playlistId/invite/:friendId",
    [authJwt.verifyToken],
    controller.inviteToPlaylist
  );
  app.post(
    "/:userId/playlist/:playlistId/acceptInvite",
    [authJwt.verifyToken],
    controller.acceptInvitePlaylist
  );
  app.delete(
    "/:userId/playlist/:playlistId/refuseInvite",
    [authJwt.verifyToken],
    controller.refuseInviteToPlaylist
  );
  app.delete(
    "/:userId/playlist/:playlistId/quitPlaylist",
    [authJwt.verifyToken],
    controller.quitPlaylist
  );

  //app.put("/:userId/playlist/:playlistId/friends/:friendId", [authJwt.verifyToken], controller.editUserPlaylist)
};
