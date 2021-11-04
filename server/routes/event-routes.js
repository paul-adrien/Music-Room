const { authJwt } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/event-controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/:userId/event", [authJwt.verifyToken], controller.getAllEvent);
    app.post("/:userId/event", [authJwt.verifyToken], controller.CreateEvent);

    app.get("/:userId/event/:eventId", [authJwt.verifyToken], controller.getEvent);
    app.delete("/:userId/event/:eventId", [authJwt.verifyToken], controller.delEvent);
    app.put("/:userId/event/:eventId", [authJwt.verifyToken], controller.editEvent);

    app.post("/:userId/event/:eventId/music/:trackId", [authJwt.verifyToken], controller.addMusicEvent);
    app.delete("/:userId/event/:eventId/music/:trackId", [authJwt.verifyToken], controller.delMusicEvent);
    // app.put("/:userId/event/:eventId/music/:trackId", [authJwt.verifyToken], controller.chageOrderevent);


    app.post("/:userId/event/:eventId/invite/:friendId", [authJwt.verifyToken], controller.inviteToEvent);
    app.post("/:userId/event/:eventId/acceptInvite", [authJwt.verifyToken], controller.acceptInviteEvent);
    app.delete("/:userId/event/:eventId/refuseInvite", [authJwt.verifyToken], controller.refuseInviteToEvent);
    app.delete("/:userId/event/:eventId/quitEvent", [authJwt.verifyToken], controller.quitEvent);
    // app.put("/:userId/playlist/:playlistId/friends/:friendId", [authJwt.verifyToken], controller.editUserEvent)
    app.post("/:userId/event/:eventId/join", [authJwt.verifyToken], controller.joinEvent);

    // router.post('/:userId/event/:eventId/musics/:trackId/vote', [authJwt.verifyToken], controller.voteMusicEvent);
    // router.delete('/:userId/event/:eventId/musics/:trackId/unvote', [authJwt.verifyToken], controller.unvoteMusicEvent);
};