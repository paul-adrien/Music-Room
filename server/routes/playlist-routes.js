const { authJwt } = require("../middlewares");
const controller = require("../controllers/playlist-controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/:userId/playlist", [authJwt.verifyToken], controller.getAllPlaylist);
    app.post("/:userId/playlist", [authJwt.verifyToken], controller.CreatePlaylist);

    app.get("/:userId/playlist/:playlistId", [authJwt.verifyToken], controller.getPlaylist);
    app.delete("/:userId/playlist/:playlistId", [authJwt.verifyToken], controller.delPlaylist);
    app.put("/:userId/playlist/:playlistId", [authJwt.verifyToken], controller.editPlaylist);

    app.post("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.addMusicPlaylist);
    app.delete("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.delMusicPlaylist);
    // app.put("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.chageOrderPlaylist);


    app.post("/:userId/playlist/:playlistId/invite/:friendId", [authJwt.verifyToken], controller.inviteToPlaylist);
    app.post("/:userId/playlist/:playlistId/acceptInvite", [authJwt.verifyToken], controller.acceptInvitePlaylist);
    app.delete("/:userId/playlist/:playlistId/refuseInvite", [authJwt.verifyToken], controller.refuseInviteToPlaylist);
    app.delete("/:userId/playlist/:playlistId/quitPlaylist", [authJwt.verifyToken], controller.quitPlaylist);
};