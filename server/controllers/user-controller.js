const { updateUser, getUser, getUsers } = require(appRoot +
  "/models/lib-user.model");
var nodemailer = require("nodemailer");
const User = require(appRoot + "/models/users.model");
var bcrypt = require("bcryptjs");

exports.userBoard = (req, res) => {
  res.json({
    status: true,
    message: "user was log",
  });
};

exports.userUpdate = async (req, res, next) => {
  const { user } = req.body;
  // console.log("test socket", res);

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
    const user = await getUser({ id: userId });
    return {
      status: true,
      message: "user was update",
      user: user,
    };
  } else {
    return {
      status: false,
      message: "user update error",
    };
  }
};

exports.userUpdatePicture = async (req, res, next) => {
  const userId = req.userId;
  // console.log("picture", req.files, userId);

  User.updateOne(
    { id: userId },
    {
      $set: {
        picture: req.files[0],
      },
    }
  ).exec((err, user) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
        user: null,
      });
    } else {
      res.message = "user picture success";
      res.status(200).json({
        status: true,
        message: "user picture success",
        user: user,
      });
    }
    next();
  });
};

exports.getProfile = async (req, res, next) => {
  // console.log("lololo", req.params.id);
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
      { userName: { $regex: search.toString(), $options: "i" } },
      { lastName: { $regex: search.toString(), $options: "i" } },
      { firstName: { $regex: search.toString(), $options: "i" } },
    ],
  });
  if (users) {
    res.message = "get users search";
    res.status(200).json(users);
  } else {
    res.message = "user doesn't exist";
    res.status(204).json({
      status: false,
      message: "user doesn't exist",
    });
  }
  next();
};

exports.checkUsername = async (req, res, next) => {
  const { userName } = req.query;
  const userId = req.params.id;
  const user = await getUser({
    id: { $ne: userId },
    userName: userName.toString(),
  });
  if (user) {
    res.message = "userName already exist";
    res.status(200).json({
      status: false,
      message: "userName already exist",
    });
  } else {
    res.message = "userName doesn't exist";
    res.status(200).json({
      status: true,
      message: "userName doesn't exist",
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
           type: "OAuth2",
           user: "42.noreplymatcha@gmail.com", //your gmail account you used to set the project up in google cloud console"
           clientId: "704787272588-v0aava438lpq06jbqkj3pkue0qv98os8.apps.googleusercontent.com",
           clientSecret: "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",
           refreshToken: "1//04XMjWIzKX6A0CgYIARAAGAQSNwF-L9Ir0I2GCKZ2rOsblkUNe9saUK7u7FkRYNbRTFJUYuPnmGY6g256cB31_wTnXv3WdhY763g"
      }});

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
        console.log('an email was send')
      }
    });
    user.rand = rand;
    if (await updateUser(user.id, user)) {
      res.message = "email was send";
      res.json({
        status: true,
        message: "email was send",
      });
    } else {
      res.message = "error with mongodb update";
      res.json({
        status: false,
        message: "error with mongodb update",
      });
    }
  } else {
    res.message = "they are no account with this email";
    res.json({
      status: false,
      message: "they are no account with this email",
    });
  }
};

exports.forgotPass_change = async (req, res, next) => {
  const { email, password, id } = req.body;
  const user = await getUser({ email: email });
  if (user) {
    user.password = bcrypt.hashSync(password, 8);
    if (user.rand == id) {
      if (await updateUser(user.id, user)) {
        res.message = "Password was changed";
        res.status(200).json({
          status: true,
          message: "Password was changed",
        });
      } else {
        res.message = "user doesn't exist";
        res.status(200).json({
          status: false,
          message: "user doesn't exist",
        });
      }
    } else {
      res.message = "wrong link";
      res.status(200).json({
        status: false,
        message: "wrong link",
      });
    }
  } else {
    res.message = "user doesn't exist";
    res.status(200).json({
      status: false,
      message: "user doesn't exist",
    });
  }
  next();
};

exports.userUpdateAccount = async (req, res, next) => {
  console.log("userUpdateAccount called !");
  const { userId, type } = req.body;
  const user = await getUser({ id: userId });
  if (user) {
    user.type = type;
    if (await updateUser(user.id, user)) {
      res.message = "Account plan was changed";
      res.status(200).json({
        status: true,
        message: "Account plan was changed",
      });
    } else {
      res.message = "user doesn't exist";
      res.status(200).json({
        status: false,
        message: "user doesn't exist",
      });
    }
  } else {
    res.message = "user doesn't exist";
    res.status(200).json({
      status: false,
      message: "user doesn't exist",
    });
  }
};

exports.userUpdateAccountSocket = async (userId, type) => {
  console.log("userUpdateAccount called !");
  const user = await getUser({ id: userId });
  if (user) {
    user.type = type;
    if (await updateUser(user.id, user)) {
      const tmp = await getUser({ id: userId });
      return {
        status: true,
        message: "Account plan was changed",
        user: tmp,
      };
    } else {
      return {
        status: true,
        message: "user doesn't exist",
        user: user,
      };
    }
  } else {
    return {
      status: false,
      message: "user doesn't exist",
    };
  }
};

exports.userUpdateMusicHistorySocket = async (userId, trackId) => {
  const user = await getUser({ id: userId });
  if (user) {
    if (user?.musicHistory?.indexOf(trackId) >= 0) {
      user.musicHistory = user?.musicHistory?.filter((el) => el !== trackId);
    } else if (user?.musicHistory?.lenght >= 5) {
      user?.musicHistory?.pop();
    }
    user.musicHistory.unshift(trackId);
    if (await updateUser(user.id, user)) {
      const tmp = await getUser({ id: userId });
      return {
        status: true,
        message: "music add to history",
        user: tmp,
      };
    } else {
      return {
        status: true,
        message: "user doesn't exist",
        user: user,
      };
    }
  } else {
    return {
      status: false,
      message: "user doesn't exist",
    };
  }
};
