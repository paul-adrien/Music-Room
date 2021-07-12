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

    app.get("/:userId/playlist", [authJwt.verifyToken], controller.getAllPlaylist, logs);
    app.post("/:userId/playlist", [authJwt.verifyToken], controller.CreatePlaylist, logs);

    app.get("/:userId/playlist/:playlistId", [authJwt.verifyToken], controller.getPlaylist, logs);
    app.delete("/:userId/playlist/:playlistId", [authJwt.verifyToken], controller.delPlaylist, logs);
    app.put("/:userId/playlist/:playlistId", [authJwt.verifyToken], controller.editPlaylist, logs);

    app.post("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.addMusicPlaylist, logs);
    app.delete("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.delMusicPlaylist, logs);
    // app.put("/:userId/playlist/:playlistId/music/:trackId", [authJwt.verifyToken], controller.chageOrderPlaylist);


    app.post("/:userId/playlist/:playlistId/invite/:friendId", [authJwt.verifyToken], controller.inviteToPlaylist, logs);
    app.post("/:userId/playlist/:playlistId/acceptInvite", [authJwt.verifyToken], controller.acceptInvitePlaylist, logs);
    app.delete("/:userId/playlist/:playlistId/refuseInvite", [authJwt.verifyToken], controller.refuseInviteToPlaylist, logs);
    app.delete("/:userId/playlist/:playlistId/quitPlaylist", [authJwt.verifyToken], controller.quitPlaylist, logs);

    //app.put("/:userId/playlist/:playlistId/friends/:friendId", [authJwt.verifyToken], controller.editUserPlaylist)
};