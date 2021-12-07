const express = require("express");
const cors = require("cors");
const dbConfig = require(appRoot + "/config/db");
const db = require(appRoot + "/models");
const passport = require("passport");

const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require(appRoot + "/openApiDocumentation");

const app = express();

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    
  })
  .catch((err) => {
    process.exit();
  });

app.use("/explorer", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get("/", function (req, res) {
  res.send("Hello World");
});

require(appRoot + "/routes/auth-routes")(app);
require(appRoot + "/routes/user-routes")(app);
require(appRoot + "/routes/music-routes")(app);
require(appRoot + "/routes/Oauth-routes")(app);
require(appRoot + "/routes/friends-routes")(app);
require(appRoot + "/routes/playlist-routes")(app);
require(appRoot + "/routes/room-routes")(app);
require(appRoot + "/routes/messaging-routes")(app);

module.exports = app;
