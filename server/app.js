const express = require('express');
const cors = require("cors");
const dbConfig = require("./config/db");
const db = require("./models");
const passport = require("passport");

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./openApiDocumentation');

const app = express();

const corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
        process.exit();
    });

app.use('/explorer', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get('/', function (req, res) {
    res.send('Hello World');
});

require("./routes/auth-routes")(app);
require("./routes/user-routes")(app);
require("./routes/music-routes")(app);
require("./routes/Oauth-routes")(app);
require("./routes/friends-routes")(app);
require("./routes/playlist-routes")(app);

module.exports = app;