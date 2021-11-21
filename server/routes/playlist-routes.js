const { authJwt, logs } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/playlist-controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/playlist", [authJwt.verifyToken], controller.getAllPlaylist, logs.logsHTTP);
  app.post("/playlist", [authJwt.verifyToken], controller.CreatePlaylist, logs.logsHTTP);

  app.get(
    "/playlist/:playlistId",
    [authJwt.verifyToken],
    controller.getPlaylist,
    logs.logsHTTP
  );
  app.delete(
    "/playlist/:playlistId/:userId",
    [authJwt.verifyToken],
    controller.delPlaylist,
    logs.logsHTTP
  );
  app.put(
    "/playlist/:playlistId",
    [authJwt.verifyToken],
    controller.editPlaylist,
    logs.logsHTTP
  );

  app.post(
    "/playlist/:playlistId/music/:trackId",
    [authJwt.verifyToken],
    controller.addMusicPlaylist,
    logs.logsHTTP
  );
  app.delete(
    "/playlist/:playlistId/music/:trackId",
    [authJwt.verifyToken],
    controller.delMusicPlaylist,
    logs.logsHTTP
  );
  // app.put("/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.chageOrderPlaylist);

  app.post(
    "/playlist/:playlistId/invite/:friendId",
    [authJwt.verifyToken],
    controller.inviteToPlaylist,
    logs.logsHTTP
  );
  app.post(
    "/playlist/:playlistId/acceptInvite",
    [authJwt.verifyToken],
    controller.acceptInvitePlaylist,
    logs.logsHTTP
  );
  // app.delete(
  //   "/playlist/:playlistId/refuseInvite",
  //   [authJwt.verifyToken],
  //   controller.refuseInviteToPlaylist,
  //   logs
  // );
  // app.delete(
  //   "/playlist/:playlistId/quitPlaylist",
  //   [authJwt.verifyToken],
  //   controller.quitPlaylist,
  //   logs
  // );

  // app.post(
  //   "/playlist/:playlistId/change-type",
  //   [authJwt.verifyToken],
  //   controller.changeType
  // );

  //app.put("/playlist/:playlistId/friends/:friendId", [authJwt.verifyToken], controller.editUserPlaylist)
};
