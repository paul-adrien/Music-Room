const db = require("../models");
const { getUser } = require("../models/lib-user.model");
const User = db.user;
const Room = db.room;

exports.getAllRoom = (req, res) => {
  Room.find({}).exec((err, rooms) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
        rooms: null,
      });
    } else if (!rooms) {
      return res.json({
        status: true,
        message: "no room",
        rooms: null,
      });
    } else {
      return res.json(rooms);
    }
  });
};

exports.CreateRoom = async (req, res) => {
  const userId = req.params.userId;

  const user = await getUser({ id: userId });

  const { name } = req.body;

  let room = new Room({
    name: name,
    created_by: userId,
    users: [{ id: userId, username: user.userName, right: true }],
    musics: [],
  });
  room.save((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    }
    res.json({
      status: true,
      message: "room created",
      room: room,
    });
  });
};

exports.getRoom = (req, res) => {
  const { roomId } = req.params;

  Room.findOne({ _id: roomId }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
        room: null,
      });
    } else if (!room) {
      return res.json({
        status: true,
        message: "no room",
        room: null,
      });
    } else {
      return res.json({
        status: true,
        message: "detail of room",
        room: room,
      });
    }
  });
};

exports.delRoom = async (req, res) => {
  const { userId, playlistId } = req.params;

  Playlist.findOne({
    $and: [
      { _id: playlistId },
      {
        $or: [
          { created_by: userId },
          { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } },
        ],
      },
    ],
  }).exec((err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      Playlist.deleteOne({ _id: playlistId }).exec((err) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        }
      });
      return res.json({
        status: true,
        message: "playlist was delete",
      });
    }
  });
};

exports.editRoom = async (req, res) => {
  const { userId, playlistId } = req.params;
  const { name, type, right, style } = req.body;

  Playlist.findOne({
    $and: [{ _id: playlistId }, { created_by: userId }],
  }).exec(async (err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
        playlist: null,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
        playlist: null,
      });
    } else {
      let editPlaylist = {
        name: name,
        created_by: userId,
        users: playlist.users,
        musics: playlist.musics,
        type: type,
        right: right,
        style: style,
      };
      const finalPlaylist = await Playlist.updateOne(
        { _id: playlist._id },
        { $set: editPlaylist }
      ).exec();
      res.json({
        status: true,
        playlist: finalPlaylist,
        message: "playlist was changed",
      });
    }
  });
};

exports.inviteToPlaylist = async (req, res) => {
  const { userId, playlistId, friendId } = req.params;
  const right = req.body.right;

  Playlist.findOne({
    $and: [{ _id: playlistId }, { created_by: userId }],
  }).exec((err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
        playlist: null,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
        playlist: null,
      });
    } else {
      User.findOne({ id: userId }).exec(async (err, user) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else if (!user) {
          return res.json({
            status: false,
            message: "this user doesn't exist",
          });
        } else {
          User.findOne({ id: friendId }).exec(async (err, friend) => {
            if (err) {
              return res.json({
                status: false,
                message: err,
              });
            } else if (!friend) {
              return res.json({
                status: false,
                message: "this friend doesn't exist",
              });
            } else {
              if (
                friend.notifs !== undefined &&
                friend.notifs.playlist !== undefined &&
                friend.notifs.playlist
                  .map((f) => {
                    return f.id;
                  })
                  .indexOf(playlistId) != -1
              )
                return res.json({
                  status: false,
                  message: "this user already invite you",
                });
              if (
                playlist.users
                  .map((e) => {
                    return e.id;
                  })
                  .indexOf(friendId) != -1
              )
                return res.json({
                  status: false,
                  message: "this useris already in this playlist",
                });
              if (
                friend.notifs.playlist === undefined ||
                friend.notifs.playlist.length == 0
              ) {
                friend.notifs.playlist = {
                  id: playlistId,
                  right: right,
                  date: Date.now(),
                };
              } else {
                await friend.notifs.playlist.push({
                  id: playlistId,
                  right: right,
                  date: Date.now(),
                });
              }
              console.log(friend);
              const finalFriend = new User(friend);
              finalFriend.save((err, friend) => {
                if (err) {
                  return res.json({
                    status: false,
                    message: err,
                  });
                } else {
                  return res.json({
                    status: true,
                    message: "invitation was send",
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.refuseInviteToPlaylist = async (req, res) => {
  const { userId, playlistId } = req.params;

  Playlist.findOne({ _id: playlistId }).exec((err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      User.findOne({ id: userId }).exec(async (err, user) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else if (!user) {
          return res.json({
            status: false,
            message: "this user doesn't exist",
          });
        } else {
          let notifIndex = user.notifs.playlist
            .map(function (u) {
              console.log(u);
              return u.id;
            })
            .indexOf(playlistId);
          if (notifIndex != -1) {
            user.notifs.playlist.splice(notifIndex, 1);
            let finalUser = new User(user);
            finalUser.save((err, playlist) => {
              if (err) {
                return res.json({
                  status: false,
                  message: err,
                });
              } else
                return res.json({
                  status: true,
                  message: "invitation delete",
                });
            });
          } else {
            return res.json({
              status: false,
              message: "you dont have invitation by this user",
            });
          }
        }
      });
    }
  });
};

exports.acceptInvitePlaylist = async (req, res) => {
  const { userId, playlistId } = req.params;

  Playlist.findOne({ _id: playlistId }).exec((err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      User.findOne({ id: userId }).exec(async (err, user) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else if (!user) {
          return res.json({
            status: false,
            message: "this user doesn't exist",
          });
        } else {
          let notifIndex = user.notifs.playlist
            .map(function (u) {
              console.log(u);
              return u.id;
            })
            .indexOf(playlistId);
          if (notifIndex != -1) {
            if (playlist.users != null) {
              playlist.users.push({
                id: userId,
                username: user.userName,
                right: user.notifs.playlist.right,
              });
            } else
              playlist.users = {
                id: userId,
                username: user.userName,
                right: user.notifs.playlist.right,
              };
            let finalPlaylist = new Playlist(playlist);
            finalPlaylist.save((err) => {
              if (err) {
                return res.json({
                  status: false,
                  message: err,
                });
              } else user.notifs.playlist.splice(notifIndex, 1);
              let finalUser = new User(user);
              finalUser.save();
              return res.json({
                status: true,
                message: "invitation was accepted",
              });
            });
          } else {
            return res.json({
              status: false,
              message: "you dont have invitation by this user",
            });
          }
        }
      });
    }
  });
};

exports.enterRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userId, deviceId } = req.body;

  const user = await getUser({ _id: userId });

  Room.findOne({ _id: roomId }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!room) {
      return res.json({
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      });
    } else {
      Room.updateOne(
        { _id: roomId },
        {
          $push: {
            users: {
              id: userId,
              deviceId: deviceId,
              username: user.userName,
              right: room.created_by === userId ? true : false,
            },
          },
        }
      ).exec((err, room) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else {
          return res.json({
            status: true,
            message: "you have enter this room",
          });
        }
      });
    }
  });
};

exports.quitRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  Room.findOne({ _id: roomId }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!room) {
      return res.json({
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      });
    } else {
      let roomIndex = room.users
        .map((u) => {
          return u.id;
        })
        .indexOf(userId);
      if (roomIndex != -1) {
        Room.updateOne(
          { _id: roomId },
          { $pull: { users: { id: userId } } }
        ).exec((err, room) => {
          if (err) {
            return res.json({
              status: false,
              message: err,
            });
          } else {
            return res.json({
              status: true,
              message: "you have quit this room",
            });
          }
        });
      } else {
        return res.json({
          status: false,
          message: "this user is not in this room",
        });
      }
    }
  });
};

exports.addMusicRoom = async (req, res) => {
  const { roomId } = req.params;
  const { trackId } = req.body;
  const duration = req.body.duration;

  Room.findOne({ _id: roomId }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!room) {
      return res.json({
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      });
    } else {
      Room.updateOne(
        { _id: roomId },
        {
          $addToSet: {
            musics: {
              trackId: trackId,
              duration: null,
            },
          },
        }
      ).exec((err, room) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else {
          return res.json({
            status: true,
            message: "music add to the list",
          });
        }
      });
    }
  });
};

exports.delMusicRoom = async (req, res) => {
  const { roomId } = req.params;
  const { trackId } = req.query;
  const duration = req.body.duration;

  Room.findOne({ _id: roomId }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!room) {
      return res.json({
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      });
    } else {
      Room.updateOne(
        { _id: roomId },
        {
          $pull: {
            musics: {
              trackId: trackId,
            },
          },
        }
      ).exec((err, room) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else {
          return res.json({
            status: true,
            message: "music remove to the list",
          });
        }
      });
    }
  });
};
