const db = require(appRoot + "/models");
const User = db.user;

async function getUserInfo(user) {}

exports.getFriendsList = (req, res, next) => {
  const { userId } = req.params;

  User.findOne({ id: userId }).exec(async (err, user) => {
    if (err) {
      res.message = "error Mongodb";
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!user) {
      res.message = "this user doesn't exist";
      res.status(400).json({
        status: false,
        message: "this user doesn't exist",
      });
    } else {
      if (user.friends !== undefined && user.friends.length > 0) {
        i = 0;
        l = user.friends.length;
        let friends = [];
        user.friends.map((friend) => {
          User.findOne({ id: friend.id }).exec((err, friendInfo) => {
            if (err) {
              res.message = "error Mongodb";
              res.status(400).json({
                status: false,
                message: err,
              });
            } else if (!friendInfo) {
              // res.message = "this friend doesn't exist";
              // res.status(400).json({
              //     status: false,
              //     message: "this friend doesn't exist"
              // });
              // next();
            } else {
              i++;
              friends.push({
                id: friendInfo.id,
                userName: friendInfo.userName,
              });
            }
            if (i == l) {
              res.message = "Friends list";
              res.status(200).json({
                status: true,
                friends: friends,
              });
            }
          });
        });
      } else {
        res.message = "Friends list";
        res.status(200).json({
          status: true,
          friends: null,
        });
      }
    }
    next();
  });
};

exports.deleteFriend = (req, res, next) => {
  const { userId, friendId } = req.params;

  User.findOne({ id: userId }).exec(async (err, user) => {
    if (err) {
      res.message = "error Mongodb";
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!user) {
      res.message = "this user doesn't exist";
      res.status(400).json({
        status: false,
        message: "this user doesn't exist",
      });
    } else {
      User.findOne({ id: friendId }).exec(async (err, friend) => {
        if (err) {
          res.message = "error Mongodb";
          res.status(400).json({
            status: false,
            message: err,
          });
        } else if (!friend) {
          res.message = "this friend doesn't exist";
          res.status(400).json({
            status: false,
            message: "this friend doesn't exist",
          });
        } else {
          User.updateOne(
            { id: friendId },
            {
              $pull: {
                friends: userId,
              },
            }
          ).exec(async (err, friend) => {
            if (err) {
              res.message = "error Mongodb";
              res.status(400).json({
                status: false,
                message: err,
              });
            } else {
              User.updateOne(
                { id: friendId },
                {
                  $pull: {
                    friends: friendId,
                  },
                }
              ).exec(async (err, user) => {
                if (err) {
                  res.message = "error Mongodb";
                  res.status(400).json({
                    status: false,
                    message: err,
                  });
                } else {
                  res.message = "delete friend";
                  res.status(200).json({
                    status: true,
                    message: "delete friend",
                  });
                }
              });
            }
          });
        }
      });
    }
    next();
  });
};

exports.deleteFriendSocket = (userId, friendId) => {
  return User.findOne({ id: userId }).then(async (user) => {
    if (!user) {
      return {
        status: false,
        message: "this user doesn't exist",
      };
    } else {
      return User.findOne({ id: friendId }).then(async (friend) => {
        if (err) {
          return {
            status: false,
            message: err,
          };
        } else if (!friend) {
          return {
            status: false,
            message: "this friend doesn't exist",
          };
        } else {
          return User.updateOne(
            { id: friendId },
            {
              $pull: {
                friends: userId,
              },
            }
          ).then(async (friend) => {
            return User.updateOne(
              { id: friendId },
              {
                $pull: {
                  friends: friendId,
                },
              }
            ).then(async (user) => {
              return {
                status: true,
                message: "delete friend",
              };
            });
          });
        }
      });
    }
  });
};

exports.inviteFriend = (req, res, next) => {
  const { userId, friendId } = req.params;

  User.findOne({ id: userId }).exec(async (err, user) => {
    if (err) {
      res.message = "error Mongodb";
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!user) {
      res.message = "this user doesn't exist";
      res.status(400).json({
        status: false,
        message: "this user doesn't exist",
      });
    } else {
      User.findOne({ id: friendId }).exec(async (err, friend) => {
        if (err) {
          res.message = "error Mongodb";
          res.status(400).json({
            status: false,
            message: err,
          });
        } else if (!friend) {
          res.message = "this friend doesn't exist";
          res.status(400).json({
            status: false,
            message: "this friend doesn't exist",
          });
        } else {
          if (
            user.notifs !== undefined &&
            user.notifs.friends !== undefined &&
            user.notifs.friends
              .map((f) => {
                return f.id;
              })
              .indexOf(friendId) != -1
          ) {
            res.message = "already sending invite";
            res.status(200).json({
              status: false,
              message: "already sending invite",
            });
          } else if (
            friend.notifs !== undefined &&
            friend.notifs.friends !== undefined &&
            friend.notifs.friends
              .map((f) => {
                return f.id;
              })
              .indexOf(userId) != -1
          ) {
            res.message = "this user already invite you";
            res.status(200).json({
              status: false,
              message: "this user already invite you",
            });
          } else {
            User.updateOne(
              { id: friendId },
              {
                $push: {
                  "notifs.friends": {
                    id: userId,
                    date: new Date(),
                  },
                },
              }
            ).exec(async (err, friend) => {
              if (err) {
                res.message = "error Mongodb";
                res.status(400).json({
                  status: false,
                  message: err,
                });
              } else {
                res.message = "invitation send";
                res.status(200).json({
                  status: true,
                  message: "invitation send",
                });
              }
            });
          }
        }
      });
    }
    next();
  });
};

exports.inviteFriendSocket = (userId, friendId) => {
  return User.findOne({ id: userId }).then(async (user) => {
    if (!user) {
      return {
        status: false,
        message: "this user doesn't exist",
      };
    } else {
      return User.findOne({ id: friendId }).then(async (friend) => {
        if (!friend) {
          return {
            status: false,
            message: "this friend doesn't exist",
          };
        } else {
          if (
            user.notifs !== undefined &&
            user.notifs.friends !== undefined &&
            user.notifs.friends
              .map((f) => {
                return f.id;
              })
              .indexOf(friendId) != -1
          ) {
            return {
              status: false,
              message: "already sending invite",
            };
          } else if (
            friend.notifs !== undefined &&
            friend.notifs.friends !== undefined &&
            friend.notifs.friends
              .map((f) => {
                return f.id;
              })
              .indexOf(userId) != -1
          ) {
            return {
              status: false,
              message: "this user already invite you",
            };
          } else {
            return User.updateOne(
              { id: friendId },
              {
                $push: {
                  "notifs.friends": {
                    id: userId,
                    date: new Date(),
                  },
                },
              }
            ).then(async (friend) => {
              return {
                status: true,
                message: "invitation send",
              };
            });
          }
        }
      });
    }
  });
};

exports.acceptInvitation = (req, res, next) => {
  const { userId, friendId } = req.params;

  User.findOne({ id: userId }).exec(async (err, user) => {
    if (err) {
      res.message = "error Mongodb";
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!user) {
      res.message = "this user doesn't exist";
      res.status(400).json({
        status: false,
        message: "this user doesn't exist",
      });
    } else {
      User.findOne({ id: friendId }).exec(async (err, friend) => {
        if (err) {
          res.message = "error Mongodb";
          res.status(400).json({
            status: false,
            message: err,
          });
        } else if (!friend) {
          res.message = "this friend doesn't exist";
          res.status(400).json({
            status: false,
            message: "this friend doesn't exist",
          });
        } else {
          User.updateOne(
            { id: friendId },
            {
              $push: {
                friends: userId,
              },
            }
          ).exec(async (err, friend) => {
            if (err) {
              res.message = "error Mongodb";
              res.status(400).json({
                status: false,
                message: err,
              });
            } else {
              User.updateOne(
                { id: friendId },
                {
                  $pull: {
                    "notifs.friends": {
                      id: friendId,
                    },
                  },
                  $push: {
                    friends: friendId,
                  },
                }
              ).exec(async (err, user) => {
                if (err) {
                  res.message = "error Mongodb";
                  res.status(400).json({
                    status: false,
                    message: err,
                  });
                } else {
                  res.message = "add friend";
                  res.status(200).json({
                    status: true,
                    message: "add friend",
                  });
                }
              });
            }
          });
        }
      });
    }
    next();
  });
};

exports.acceptInvitationSocket = (userId, friendId) => {
  return User.findOne({ id: userId }).then(async (user) => {
    if (!user) {
      return {
        status: false,
        message: "this user doesn't exist",
      };
    } else {
      return User.findOne({ id: friendId }).then(async (friend) => {
        if (!friend) {
          return {
            status: false,
            message: "this friend doesn't exist",
          };
        } else {
          return User.updateOne(
            { id: friendId },
            {
              $push: {
                friends: userId,
              },
            }
          ).then(async (friend) => {
            return User.updateOne(
              { id: friendId },
              {
                $pull: {
                  "notifs.friends": {
                    id: friendId,
                  },
                },
                $push: {
                  friends: friendId,
                },
              }
            ).then(async (user) => {
              return {
                status: true,
                message: "add friend",
              };
            });
          });
        }
      });
    }
  });
};
