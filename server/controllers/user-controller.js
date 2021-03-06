const { updateUser, getUser, getUsers } = require(appRoot +
  "/models/lib-user.model");
var nodemailer = require("nodemailer");
const db = require(appRoot + "/models");
const User = db.user;
const Room = db.room;
const Playlist = db.playlist;
const Conversation = db.conversation;
const ForgotPass = db.forgotPass;
var bcrypt = require("bcryptjs");
const path = require("path");

exports.userBoard = (req, res) => {
  res.json({
    status: true,
    message: "user was log",
  });
};

exports.userUpdate = async (req, res, next) => {
  const { user } = req.body;
  // 

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
  // 

  User.updateOne(
    { id: userId },
    {
      $set: {
        picture:
          "data:image/jpeg;base64," + req.files[0].buffer.toString("base64"),
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
  // 
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
    var rand = Math.floor(Math.random() * 100000 + 54);

    ForgotPass.updateOne(
      { email: email },
      { email: email, rand: rand },
      { upsert: true }
    ).exec();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "42.noreplymatcha@gmail.com", //your gmail account you used to set the project up in google cloud console"
        clientId:
          "704787272588-v0aava438lpq06jbqkj3pkue0qv98os8.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//04LthjLvmXx6aCgYIARAAGAQSNwF-L9IriR5qSihiPChbBOtqwREH1p9mqlN0XvgvecftRiIKMD37j0G9cIIo02Zd2bIOvq1h62M",
      },
    });

    var mailOptions = {
      from: "42.noreplymatcha@gmail.com",
      to: email,
      subject: "Reset password",
      html:
        "Hello,<br> Please enter this code: <span style='font-weight: bold'>" +
        rand +
        "</span> on the app to reset your password.<br>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
        
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

exports.forgotPass_check = async (req, res, next) => {
  const { email, password, rand } = req.body;
  
  const user = await getUser({ email: email });
  if (user) {
    ForgotPass.findOne({ email: email }).exec(async (err, data) => {
      
      if (err) {
        res.status(400).json({
          status: false,
          message: err,
        });
      } else if (!data) {
        res.status(201).json({
          status: true,
          message: "No code",
        });
      } else {
        
        if (bcrypt.compareSync(password, user.password) === true) {
          res.status(200).json({
            status: false,
            message: "Same password",
          });
        } else {
          user.password = bcrypt.hashSync(password, 8);
          if (parseInt(rand) === data.rand) {
            if (await updateUser(user.id, user)) {
              ForgotPass.deleteOne({ email: email }).exec();
              res.status(200).json({
                status: true,
                message: "Your passward was changed",
              });
            } else {
              res.status(200).json({
                status: false,
                message: "user doesn't exist",
              });
            }
          } else {
            res.status(200).json({
              status: false,
              message: "Wrong code, please take the last code send by mail",
            });
          }
        }
      }
    });
  } else {
    res.status(200).json({
      status: false,
      message: "user doesn't exist",
    });
  }
};

exports.userUpdateAccount = async (req, res, next) => {
  
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
    } else if (user?.musicHistory?.length >= 5) {
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

exports.sendVerifyEmail = async (req, res) => {
  const email = req.body.email;

  const user = await getUser({ email: email });
  if (user) {
    var rand = Math.floor(Math.random() * 100000 + 54);
    var link =
      "https://music.room.projet42web.fr/verify/" + rand + "/email/" + email;

    user.rand = rand;
    await updateUser(user._id, user);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "42.noreplymatcha@gmail.com", //your gmail account you used to set the project up in google cloud console"
        clientId:
          "704787272588-v0aava438lpq06jbqkj3pkue0qv98os8.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken:
          "1//04LthjLvmXx6aCgYIARAAGAQSNwF-L9IriR5qSihiPChbBOtqwREH1p9mqlN0XvgvecftRiIKMD37j0G9cIIo02Zd2bIOvq1h62M",
      },
    });

    var mailOptions = {
      from: "42.noreplymatcha@gmail.com",
      to: email,
      subject: "Please confirm your Email account",
      html:
        "Hello,<br> Please Click on the link to verify your email.<br><a rel='noopener noreferrer' target='_blank' href=" +
        link +
        ">Click here to verify</a>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        
        res.status(200).json({
          status: true,
          message: error,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "an email was send",
        });
        
      }
    });
  } else {
    res.status(200).json({
      status: false,
      message: "user doesn't exist",
    });
  }
};

exports.verifyEmail = async (req, res, next) => {
  const { rand, email } = req.params;
  

  const user = await getUser({
    $and: [
      {
        email: email,
      },
      { id: { $not: { $regex: /42_/ } } },
      { id: { $not: { $regex: /google_/ } } },
      { id: { $not: { $regex: /git_/ } } },
    ],
  });
  
  if (user) {
    
    if (parseInt(rand) === user.rand) {
      user.rand = null;
      user.validEmail = true;
      
      await updateUser(user._id, user);
      res.sendFile(path.join(appRoot, "/html/verifEmail.html"));
    } else {
      res.sendFile(path.join(appRoot, "/html/errorVerifEmail.html"));
    }
  } else {
    res.sendFile(path.join(appRoot, "/html/errorVerifEmail.html"));
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  const user = await getUser({ id: userId });
  if (user) {
    User.deleteOne({ id: userId }).exec(async (err, user) => {
      if (err) {
        res.message = err;
        res.status(400).json({
          status: false,
          message: err,
        });
      } else {
        await User.updateMany(
          { friends: { id: userId } },
          { $pull: { friends: { id: userId } } }
        ).exec();
        await Room.deleteMany({ created_by: userId }).exec();
        await Playlist.deleteMany({ created_by: userId }).exec();
        await Room.updateMany(
          {
            $or: [{ invited: userId }, { "users.id": userId }],
          },
          { $pull: { invited: userId, users: { id: userId } } }
        ).exec();
        await Playlist.updateMany(
          {
            $or: [{ invited: userId }, { "users.id": userId }],
          },
          { $pull: { invited: userId, users: { id: userId } } }
        ).exec();
        await Conversation.deleteMany({
          $and: [{ "users.userId": userId }, { "users.2": { $exists: false } }],
        }).exec();
        await Conversation.updateMany(
          {
            $and: [
              { "users.userId": userId },
              { "users.2": { $exists: true } },
            ],
          },
          { $pull: { users: { userId: userId } } }
        ).exec();

        res.message = "user delete";
        res.status(200).json({
          status: true,
          message: "user delete",
        });
      }
    });
  } else {
    res.status(400).json({
      status: false,
      message: "user doesn't exist",
    });
  }
};
