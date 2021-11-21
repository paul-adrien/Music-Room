const controller = require(appRoot + "/controllers/messaging-controller");
const { authJwt, logs } = require(appRoot + "/middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // app.post("/user/:userId/conversation", controller.createConversation);
    app.get("/user/:userId/conversation", controller.getConversationList, logs.logsHTTP);
    app.get("/user/:userId/conversation/:conversationId", controller.getConversationDetail, logs.logsHTTP);
    // app.patch("/user/:userId/conversation/:conversationId", controller.updateConversation);
    // app.delete("/user/:userId/conversation/:conversationId", controller.deleteConversation);
};
