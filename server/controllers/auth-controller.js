const config = require(appRoot + "/config/auth");
const db = require(appRoot + "/models");
const User = db.user;
var nodemailer = require("nodemailer");
const { updateUser } = require(appRoot + "/models/lib-user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.findOne({
    $and: [
      {
        userName: req.body.userName,
      },
      { id: { $not: { $regex: /42_/ } } },
      { id: { $not: { $regex: /google_/ } } },
      { id: { $not: { $regex: /git_/ } } },
    ],
  }).exec((err, user) => {
    if (user) {
      return res.json({
        status: false,
        message: "userName already exist.",
      });
    }
  });

  var rand = Math.floor(Math.random() * 100000 + 54);
  var link = "http://54.38.243.206/verify/" + rand + '/email/' + req.body.email;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "42.noreplymatcha@gmail.com", //your gmail account you used to set the project up in google cloud console"
      clientId:
        "704787272588-v0aava438lpq06jbqkj3pkue0qv98os8.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04XMjWIzKX6A0CgYIARAAGAQSNwF-L9Ir0I2GCKZ2rOsblkUNe9saUK7u7FkRYNbRTFJUYuPnmGY6g256cB31_wTnXv3WdhY763g",
    },
  });

  var mailOptions = {
    from: "42.noreplymatcha@gmail.com",
    to: req.body.email,
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a target='_blank' href=" +
      link +
      ">Click here to verify</a>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
    } else {
      console.log("an email was send");
    }
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    password: bcrypt.hashSync(req.body.password, 8),
    rand: rand,
    validEmail: false
  });

  user.id = user._id;

  user.save((err, user) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    return res.json({
      status: true,
      id: user.id,
      userName: user.userName,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      accessToken: token,
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    $and: [
      {
        userName: req.body.userName,
      },

      { id: { $not: { $regex: /42_/ } } },
      { id: { $not: { $regex: /google_/ } } },
      { id: { $not: { $regex: /git_/ } } },
    ],
  }).exec((err, user) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    }

    // console.log(user);

    if (user === null) {
      return res.json({
        status: false,
        message: "User Not found.",
      });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.json({
      status: true,
      id: user.id,
      userName: user.userName,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      accessToken: token,
    });
  });
};

exports.stockAppInfo = (req, res, next) => {
  const { userId, model, platform, version} = req.body;

  console.log(userId, model, platform, version);

  User.findOne({ _id: userId }).exec(async (user) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!user) {
      res.message = "user doesn't exist";
      res.status(200).json({
        status: false,
        message: "user doesn't exist",
      });
    } else {
      user.application = { model: model, platform: platform, version: version };
      if (await updateUser(userId)) {
        res.message = "user application update";
        res.status(200).json({
          status: false,
          message: "user application update",
        });
      } else {
        res.message = "error when update application information";
        res.status(200).json({
          status: false,
          message: "error when update application information",
        });
      }
    }
  })
}
