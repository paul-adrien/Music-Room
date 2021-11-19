const db = require(appRoot + "/models");
const { getUser } = require(appRoot + "/models/lib-user.model");

const User = db.user;
const Playlist = db.playlist;

exports.getAllPlaylist = (req, res) => {
  const { userId } = req.query;
  // console.log("negro", userId);
  Playlist.find(userId !== "undefined" ? { created_by: userId } : {}).exec(
    (err, playlists) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: err,
          playlists: null,
        });
      } else if (!playlists) {
        return res.status(201).json({
          status: true,
          message: "no playlist",
          playlists: null,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "playlists success",
          playlists: playlists,
        });
      }
    }
  );
};

exports.getAllPlaylistSocket = async () => {
  return Playlist.find({}).then((playlists) => {
    if (!playlists) {
      return {
        status: true,
        message: "no room",
        playlists: null,
      };
    } else {
      return {
        status: true,
        message: "playlists success",
        playlists: playlists,
      };
    }
  });
};

exports.CreatePlaylist = async (req, res) => {
  const { name, userId } = req.body;
  const user = await getUser({ id: userId });

  let playlist = new Playlist({
    name: name,
    created_by: userId,
    users: [{ id: userId, username: user.userName }],
    musics: [],
    type: "public",
  });
  playlist.save((err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    }
    res.json({
      status: true,
      message: "playlist created",
      playlist: playlist,
    });
  });
};

exports.CreatePlaylistSocket = async (name, userId) => {
  const user = await getUser({ id: userId });

  await Playlist.insertMany([
    {
      name: name,
      created_by: userId,
      users: [{ id: userId, username: user.userName }],
      musics: [],
      type: "public",
    },
  ]);
};

exports.checkName = (req, res) => {
  const { playlistName } = req.params;

  Playlist.findOne({ name: playlistName }).exec((err, playlist) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
        playlist: null,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "no playlist",
        playlist: null,
      });
    } else {
      return res.json({
        status: true,
        message: "playlist name exist",
        playlist: playlist,
      });
    }
  });
};

exports.getPlaylist = (req, res, next) => {
  const { playlistId } = req.params;

  Playlist.findOne({ _id: playlistId }).exec((err, playlist) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
        playlist: null,
      });
    } else if (!playlist) {
      res.message = "no playlist";
      res.status(201).json({
        status: true,
        message: "no playlist",
        playlists: null,
      });
    } else {
      res.message = "detail of playlist";
      res.status(200).json({
        status: true,
        message: "detail of playlist",
        playlist: playlist,
      });
    }
    next();
  });
};

exports.getPlaylistSocket = async (playlistId) => {
  return Playlist.findOne({ _id: playlistId }).then((playlist) => {
    if (!playlist) {
      return {
        status: true,
        message: "no playlist",
        playlist: null,
      };
    } else {
      if (playlist.musics.length > 1) {
        playlist.musics = playlist?.musics?.sort(
          (a, b) => b.nb_vote - a.nb_vote
        );
      }
      return {
        status: true,
        message: "detail of playlist",
        playlist: playlist,
      };
    }
  });
};

exports.delPlaylist = async (req, res, next) => {
  const { userId, playlistId } = req.params;

  Playlist.findOne({
    $and: [
      { _id: playlistId },
      {
        $or: [{ created_by: userId }],
      },
    ],
  }).exec((err, playlist) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      res.message =
        "this playlist doesn't exist or you dont have the good right";
      res.status(201).json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      Playlist.deleteOne({ _id: playlistId }).exec((err) => {
        if (err) {
          res.message = err;
          res.status(401).json({
            status: false,
            message: err,
          });
        }
      });
      res.message = "playlist was delete";
      res.status(200).json({
        status: true,
        message: "playlist was delete",
      });
    }
    next();
  });
};

exports.delPlaylistSocket = async (userId, playlistId) => {
  return Playlist.findOne({
    $and: [{ _id: playlistId }, { created_by: userId }],
  }).then((playlist) => {
    if (!playlist) {
      return {
        status: false,
        message: "this playlist doesn't exist or you dont have the good right",
      };
    } else {
      return Playlist.deleteOne({ _id: playlistId }).then(() => {
        return {
          status: true,
          message: "Playlist was delete",
        };
      });
    }
  });
};

exports.editPlaylist = async (req, res, next) => {
  const { playlistId } = req.params;
  const playlistBody = req.body.playlist;

  Playlist.findOne({ _id: playlistId }).exec(async (err, playlist) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
        playlist: null,
      });
    } else if (!playlist) {
      res.message =
        "this playlist doesn't exist or you dont have the good right";
      res.status(201).json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
        playlist: null,
      });
    } else {
      Playlist.updateOne({ _id: playlistId }, { $set: playlistBody }).exec(
        async (err, playlist) => {
          if (err) {
            // console.log();
            res.message = err;
            return res.status(400).json({
              status: false,
              message: err,
              playlist: null,
            });
          } else {
            res.message = "playlist was changed";
            return res.status(200).json({
              status: true,
              playlist: playlist,
              message: "playlist was changed",
            });
          }
        }
      );
    }
  });
};

exports.editPlaylistSocket = async (playlistId, playlistBody) => {
  return Playlist.findOne({ _id: playlistId }).then(async (playlist) => {
    if (!playlist) {
      return {
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
        playlist: null,
      };
    } else {
      return Playlist.updateOne(
        { _id: playlistId },
        { $set: playlistBody }
      ).then(async (playlist) => {
        return {
          status: true,
          playlist: playlist,
          message: "playlist was changed",
        };
      });
    }
  });
};

exports.inviteToPlaylist = async (req, res, next) => {
  const { playlistId, friendId } = req.params;
  const { userId, right } = req.body;
  // console.log(friendId);

  Playlist.findOne({
    _id: playlistId,
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
                playlist.invited?.length > 0 &&
                playlist.invited.find((el) => el === friendId)
              ) {
                return res.json({
                  status: false,
                  message: "this user is already invited",
                });
              } else if (
                friend.notifs !== undefined &&
                friend.notifs.playlist !== undefined &&
                friend?.notifs?.playlist.find(
                  (playlist) => playlist.id === playlistId
                )
              ) {
                return res.json({
                  status: false,
                  message: "this user is already invited",
                });
              } else {
                User.updateOne(
                  { id: friendId },
                  {
                    $push: {
                      "notifs.playlist": {
                        id: playlistId,
                        name: playlist.name,
                        date: Date.now(),
                      },
                    },
                  }
                ).exec((err, user) => {
                  if (err) {
                    return res.json({
                      status: false,
                      message: err,
                    });
                  } else {
                    return res.json({
                      status: true,
                      message: "invite send",
                    });
                  }
                });
              }
            }
          });
        }
      });
    }
  });
};

exports.inviteToPlaylistSocket = async (userId, playlistId, friendId) => {
  return Playlist.findOne({
    _id: playlistId,
  }).then((playlist) => {
    if (!playlist) {
      return {
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
        playlist: null,
      };
    } else {
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
                playlist.invited?.length > 0 &&
                playlist.invited.find((el) => el === friendId)
              ) {
                return {
                  status: false,
                  message: "this user is already invited",
                };
              } else if (
                friend.notifs !== undefined &&
                friend.notifs.playlist !== undefined &&
                friend?.notifs?.playlist.find(
                  (playlist) => playlist.id === playlistId
                )
              ) {
                return {
                  status: false,
                  message: "this user is already invited",
                };
              } else {
                return User.updateOne(
                  { id: friendId },
                  {
                    $push: {
                      "notifs.playlist": {
                        id: playlistId,
                        name: playlist.name,
                        date: Date.now(),
                      },
                    },
                  }
                ).then((user) => {
                  return {
                    status: true,
                    message: "invite send",
                  };
                });
              }
            }
          });
        }
      });
    }
  });
};

exports.refuseInviteToPlaylist = async (req, res, next) => {
  const { userId, playlistId } = req.params;

  Playlist.findOne({ _id: playlistId }).exec((err, playlist) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      res.message =
        "this playlist doesn't exist or you dont have the good right";
      res.status(401).json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      User.findOne({ id: userId }).exec(async (err, user) => {
        if (err) {
          res.message = err;
          res.status(402).json({
            status: false,
            message: err,
          });
        } else if (!user) {
          res.message = "this user doesn't exist";
          res.status(403).json({
            status: false,
            message: "this user doesn't exist",
          });
        } else {
          let notifIndex = user.notifs.playlist
            .map(function (u) {
              // console.log(u);
              return u.id;
            })
            .indexOf(playlistId);
          if (notifIndex != -1) {
            user.notifs.playlist.splice(notifIndex, 1);
            let finalUser = new User(user);
            finalUser.save((err, playlist) => {
              if (err) {
                res.message = err;
                res.status(404).json({
                  status: false,
                  message: err,
                });
              } else {
                res.message = "invitation delete";
                res.status(200).json({
                  status: true,
                  message: "invitation delete",
                });
              }
            });
          } else {
            res.message = "you dont have invitation by this user";
            res.status(405).json({
              status: false,
              message: "you dont have invitation by this user",
            });
          }
        }
      });
    }
    next();
  });
};

exports.acceptInvitePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { userId } = req.body;

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
      Playlist.updateOne(
        { _id: playlistId },
        { $push: { invited: userId } }
      ).exec((err, playlist) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        } else {
          return res.json({
            status: true,
            message: "you accept to enter this playlist",
          });
        }
      });
    }
  });
};

exports.acceptInvitePlaylistSocket = async (userId, playlistId) => {
  return Playlist.findOne({ _id: playlistId }).then((playlist) => {
    if (!playlist) {
      return {
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      };
    } else {
      return Playlist.updateOne(
        { _id: playlistId },
        { $push: { invited: userId } }
      ).then((playlist) => {
        return {
          status: true,
          message: "you accept to enter this playlist",
        };
      });
    }
  });
};

exports.quitPlaylist = async (req, res, next) => {
  const { userId, playlistId } = req.params;

  Playlist.findOne({ _id: playlistId }).exec((err, playlist) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      res.message =
        "this playlist doesn't exist or you dont have the good right";
      res.status(401).json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      let playlistIndex = playlist.users
        .map((u) => {
          return u.id;
        })
        .indexOf(userId);
      if (playlistIndex != -1) {
        playlist.users.splice(playlistIndex, 1);
        const finalPlaylist = new Playlist(playlist);
        finalPlaylist.save();
        res.message = "you have quit this playlist";
        res.status(200).json({
          status: true,
          message: "you have quit this playlist",
        });
      } else {
        res.message = "this user is not in this playlist";
        res.status(402).json({
          status: false,
          message: "this user is not in this playlist",
        });
      }
    }
    next();
  });
};

exports.addMusicPlaylist = async (req, res, next) => {
  const { playlistId } = req.params;
  const { trackId, userId } = req.body;
  const duration = req.body.duration;

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
      Playlist.updateOne(
        { _id: playlistId },
        {
          $addToSet: {
            musics: {
              trackId: trackId,
              duration: null,
            },
          },
        }
      ).exec((err, playlist) => {
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

exports.addMusicPlaylistSocket = async (playlistId, userId, trackId) => {
  return Playlist.findOne({ _id: playlistId }).then((playlist) => {
    if (!playlist) {
      return {
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      };
    } else {
      return Playlist.updateOne(
        { _id: playlistId },
        {
          $addToSet: {
            musics: {
              trackId: trackId,
              duration: null,
            },
          },
        }
      ).then((playlist) => {
        return {
          status: true,
          message: "music add to the list",
        };
      });
    }
  });
};

exports.delMusicPlaylist = async (req, res, next) => {
  const { playlistId, trackId } = req.params;
  const duration = req.body.duration;

  Playlist.findOne({ _id: playlistId }).exec((err, playlist) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!playlist) {
      return res.json({
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      });
    } else {
      Playlist.updateOne(
        { _id: playlistId },
        {
          $pull: {
            musics: {
              trackId: trackId,
            },
          },
        }
      ).exec((err, playlist) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: err,
          });
        } else {
          return res.status(200).json({
            status: true,
            playlist: playlist,
            message: "music remove to the list",
          });
        }
      });
    }
  });
};

exports.delMusicPlaylistSocket = async (playlistId, trackId) => {
  return Playlist.findOne({ _id: playlistId }).then((playlist) => {
    if (!playlist) {
      return {
        status: true,
        message: "this playlist doesn't exist or you dont have the good right",
      };
    } else {
      return Playlist.updateOne(
        { _id: playlistId },
        {
          $pull: {
            musics: {
              trackId: trackId,
            },
          },
        }
      ).then((playlist) => {
        return {
          status: true,
          playlist: playlist,
          message: "music remove to the list",
        };
      });
    }
  });
};

exports.changeType = async (req, res) => {
  const { playlistId } = req.params;
  const { type, userId } = req.body;

  Playlist.findOne({ _id: playlistId, created_by: userId }).exec(
    (err, playlist) => {
      if (err) {
        return res.json({
          status: false,
          message: err,
        });
      } else if (!playlist) {
        return res.json({
          status: true,
          message:
            "this playlist doesn't exist or you dont have the good right",
        });
      } else {
        Playlist.updateOne(
          { _id: playlistId },
          {
            type: type,
          }
        ).exec((err, playlist) => {
          if (err) {
            return res.json({
              status: false,
              message: err,
            });
          } else {
            return res.json({
              status: true,
              message: "this playlist change type",
            });
          }
        });
      }
    }
  );
};

exports.changeTypeSocket = async (userId, playlistId, type) => {
  return Playlist.findOne({ _id: playlistId, created_by: userId }).then(
    (playlist) => {
      if (!playlist) {
        return {
          status: true,
          message:
            "this playlist doesn't exist or you dont have the good right",
        };
      } else {
        return Playlist.updateOne(
          { _id: playlistId },
          {
            type: type,
          }
        ).then((playlist) => {
          return {
            status: true,
            message: "this playlist change type",
          };
        });
      }
    }
  );
};
