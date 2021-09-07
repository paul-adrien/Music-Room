const { authJwt } = require("../middlewares");
const controller = require("../controllers/playlist-controller");
const logs = require("../middlewares/logs");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/playlist", [authJwt.verifyToken], controller.getAllPlaylist, logs);
  app.post("/playlist", [authJwt.verifyToken], controller.CreatePlaylist, logs);

  app.get(
    "/playlist/:playlistId",
    [authJwt.verifyToken],
    controller.getPlaylist,
    logs
  );
  app.delete(
    "/playlist/:playlistId",
    [authJwt.verifyToken],
    controller.delPlaylist,
    logs
  );
  app.put(
    "/playlist/:playlistId",
    [authJwt.verifyToken],
    controller.editPlaylist,
    logs
  );

  app.post(
    "/playlist/:playlistId/music/:trackId",
    [authJwt.verifyToken],
    controller.addMusicPlaylist,
    logs
  );
  app.delete(
    "/playlist/:playlistId/music/:trackId",
    [authJwt.verifyToken],
    controller.delMusicPlaylist,
    logs
  );
  // app.put("/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.chageOrderPlaylist);

  app.post(
    "/playlist/:playlistId/invite/:friendId",
    [authJwt.verifyToken],
    controller.inviteToPlaylist,
    logs
  );
  app.post(
    "/playlist/:playlistId/acceptInvite",
    [authJwt.verifyToken],
    controller.acceptInvitePlaylist,
    logs
  );
  app.delete(
    "/playlist/:playlistId/refuseInvite",
    [authJwt.verifyToken],
    controller.refuseInviteToPlaylist,
    logs
  );
  app.delete(
    "/playlist/:playlistId/quitPlaylist",
    [authJwt.verifyToken],
    controller.quitPlaylist,
    logs
  );

  //app.put("/playlist/:playlistId/friends/:friendId", [authJwt.verifyToken], controller.editUserPlaylist)
};
