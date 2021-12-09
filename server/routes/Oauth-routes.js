const { verifySignUp } = require(appRoot + "/middlewares");
const passport = require(appRoot + "/config/passport-config");
const config = require(appRoot + "/config/auth");
var jwt = require("jsonwebtoken");
const { getUser, updateUser } = require(appRoot + "/models/lib-user.model");
const db = require(appRoot + "/models");
const Token = db.token;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept, *"
    );
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.get("/user/authenticate/42", (req, res, next) => {
    passport.authenticate("42", {
      state: JSON.stringify(req.query),
    })(req, res, next);
  });
  app.get("/user/authenticate/42/callback", (req, res, next) => {
    passport.authenticate(
      "42",
      {
        failureRedirect: "http://localhost:8100/login",
      },
      async (err, data) => {
        const userDb = await getUser({ id: data.userId });
        const token = jwt.sign({ id: userDb._id }, config.secret, {
          expiresIn: 86400, // 24 hours
        });

        userDb.application = data.application;
        await updateUser(data.userId, userDb);

        await Token.insertMany([
          {
            token: token,
            userId: userDb._id,
            date: Date.now(),
          },
        ]);

        return res.redirect(
          "http://localhost:8100/login?data=" +
            encodeURI(
              JSON.stringify({
                user: userDb,
                token: token,
              })
            )
        );
      }
    )(req, res, next);
  });

  app.get("/user/authenticate/google", (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: JSON.stringify(req.query),
    })(req, res, next);
  });
  app.get("/user/authenticate/google/callback", (req, res, next) => {
    passport.authenticate(
      "google",
      {
        failureRedirect: "http://localhost:8100/login",
      },
      async (err, data) => {
        // Successful authentication, redirect home.
        if (data?.userId) {
          const userDb = await getUser({ id: data.userId });

          const token = jwt.sign({ id: userDb._id }, config.secret, {
            expiresIn: 86400, // 24 hours
          });

          userDb.application = data.application;
          await updateUser(data.userId, userDb);

          await Token.insertMany([
            {
              token: token,
              userId: userDb._id,
              date: Date.now(),
            },
          ]);

          return res.redirect(
            "http://localhost:8100/login?data=" +
              encodeURI(
                JSON.stringify({
                  user: userDb,
                  token: token,
                })
              )
          );
        }
      }
    )(req, res, next);
  });

  app.get("/user/authenticate/google-link/:userId", (req, res, next) => {
    req.userId = req.params.userId;
    passport.authenticate("google-link", {
      scope: ["profile", "email"],
      state: req.params.userId,
    })(req, res, next);
  });

  app.get("/user/authenticate/google/callback-link", (req, res, next) => {
    passport.authenticate(
      "google-link",
      {
        failureRedirect: "http://localhost:8100/login",
      },
      async (err, userId) => {
        if (userId) {
          const userDb = await getUser({ id: userId });

          return res.redirect(
            "http://localhost:8100/tabs/tab-profile/settings?data=" +
              encodeURI(
                JSON.stringify({
                  user: userDb,
                })
              )
          );
        } else {
          return res.redirect(
            "http://localhost:8100/tabs/tab-profile/settings?data=" +
              encodeURI(JSON.stringify(undefined))
          );
        }
      }
    )(req, res, next);
  });

  // app.get(
  //   "/user/authenticate/github",
  //   passport.authenticate("github", { scope: ["user:email"] })
  // );
  // app.get("/user/authenticate/github/callback", (req, res, next) => {
  //   passport.authenticate(
  //     "github",
  //     {
  //       failureRedirect: "http://localhost:8100/login",
  //     },
  //     async (err, userId) => {
  //       // Successful authentication, redirect home.
  //       const userDb = await getUser({ id: userId });

  //       const token = jwt.sign({ id: userDb._id }, config.secret, {
  //         expiresIn: 86400, // 24 hours
  //       });

  //       return res.redirect(
  //         "http://localhost:8100/login?data=" +
  //         encodeURI(
  //           JSON.stringify({
  //             user: userDb,
  //             token: token,
  //           })
  //         )
  //       );
  //     }
  //   )(req, res, next);
  // });
};
