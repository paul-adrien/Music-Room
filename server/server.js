var express = require('express');
const cors = require("cors");
const dbConfig = require("./config/db");
const db = require("./models");
const passport = require("passport");

var app = express();

var corsOptions = {
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
        //console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
        process.exit();
    });

app.get('/', function (req, res) {
    res.send('Hello World');
});

require("./routes/auth-routes")(app);
require("./routes/user-routes")(app);
require("./routes/music-routes")(app);
require("./routes/Oauth-routes")(app);

var server = app.listen(8080, function () {
    console.log("Example app listening at 8080")
})