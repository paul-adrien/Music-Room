const { updateUser, getUser, getUsers } = require("../models/lib-user.model");
var nodemailer = require("nodemailer");
const User = require("../models/users.model");
var bcrypt = require("bcryptjs");

exports.userBoard = (req, res) => {
  res.json({
    status: true,
    message: "user was log",
  });
};

exports.userUpdate = async (req, res, next) => {
  const { user } = req.body;
  if (await updateUser(req.params.id, user)) {
    const user = await getUser({ id: req.params.id });
    res.message = "user was update";
    res.status(200).json(user);
  } else {
    res.message = "user update error";
    res.status(400).json({
      status: false,
      message: "user update error",
    });
  }
  next();
};

exports.userUpdateSocket = async (userId, user) => {
  if (await updateUser(userId, user)) {
    return await getUser({ id: userId });
  } else {
    return undefined;
  }
};

exports.getProfile = async (req, res, next) => {
  const user = await getUser({ id: req.params.id });
  if (user) {
    res.message = "send user";
    res.status(200).json(user);
  } else {
    res.message = "user doesn't exist";
    res.status(400).json({
      status: false,
      message: "user doesn't exist",
    });
  }
  next();
};

exports.getSearchProfile = async (req, res, next) => {
  const { search } = req.query;
  const users = await getUsers({
    $or: [
      { userName: { $regex: search.toString() } },
      { lastName: { $regex: search.toString() } },
      { firstName: { $regex: search.toString() } },
    ],
  });
  if (users) {
    ///res.message = "get users search";
    res.status(200).json(users);
  } else {
    res.message = "user doesn't exist";
    res.status(400).json({
      status: false,
      message: "user doesn't exist",
    });
  }
  next();
};

exports.forgotPass_send = async (req, res) => {
  const email = req.body.email;
  var user = new User();

  if ((user = await getUser({ email: email }))) {
    var rand = Math.floor(Math.random() * 100 + 54);
    var link = "http://localhost:8081/forgotPass/" + rand;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "42.noreplymatcha@gmail.com",
        pass: "GguyotPlaurent76",
      },
    });

    var mailOptions = {
      from: "42.noreplymatcha@gmail.com",
      to: email,
      subject: "Reset password",
      html:
        "Hello,<br> Please Click on the link to reset your password.<br><a href=" +
        link +
        ">Click here to verify</a>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
      }
    });
    user.rand = rand;
    if (await updateUser(user.id, user)) {
      res.json({
        status: true,
        message: "email was send",
      });
    } else {
      res.json({
        status: false,
        message: "error with mongodb update",
      });
    }
  } else {
    res.json({
      status: false,
      message: "they are no account with this email",
    });
  }
};

exports.forgotPass_change = async (req, res) => {
  const { email, password, id } = req.body;
  const user = await getUser({ email: email });
  if (user) {
    user.password = bcrypt.hashSync(password, 8);
    if (user.rand == id) {
      if (await updateUser(user.id, user)) {
        res.json({
          status: true,
          message: "Password was changed",
        });
      } else {
        res.json({
          status: false,
          message: "user doesn't exist",
        });
      }
    } else {
      res.json({
        status: false,
        message: "wrong link",
      });
    }
  } else {
    res.json({
      status: false,
      message: "user doesn't exist",
    });
  }
};
