const { authJwt, logs } = require(appRoot + "/middlewares");
const controller = require(appRoot + "/controllers/friends-controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/user/:userId/friends', [authJwt.verifyToken], controller.getFriendsList, logs.logsHTTP);
    app.delete('/user/:userId/friends/:friendId', [authJwt.verifyToken], controller.deleteFriend, logs.logsHTTP);
    app.post('/user/:userId/friends/:friendId/invite', [authJwt.verifyToken], controller.inviteFriend, logs.logsHTTP);
    app.post('/user/:userId/friends/:friendId/acceptInvitation', [authJwt.verifyToken], controller.acceptInvitation, logs.logsHTTP);
    app.delete('/user/:userId/friends/:friendId/refuseInvitation', [authJwt.verifyToken], controller.refuseInvitation, logs.logsHTTP);
};