const db = require(appRoot + "/models");
const { getUser } = require(appRoot + "/models/lib-user.model");
const User = db.user;
const Room = db.room;
const geolib = require("geolib");

exports.getAllRoom = (req, res) => {
  const { userId } = req.query;

  Room.find(userId !== "undefined" ? { created_by: userId } : {}).exec(
    (err, rooms) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: err,
          rooms: null,
        });
      } else if (!rooms) {
        return res.status(201).json({
          status: true,
          message: "no room",
          rooms: null,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "rooms success",
          rooms: rooms,
        });
      }
    }
  );
};

exports.getAllRoomSocket = async () => {
  console.log(
    "socket",
    Room.find({}).then((err, rooms) => {
      if (err) {
        return {
          status: false,
          message: err,
          rooms: null,
        };
      } else if (!rooms) {
        return {
          status: true,
          message: "no room",
          rooms: null,
        };
      } else {
        return {
          status: true,
          message: "rooms success",
          rooms: rooms,
        };
      }
    })
  );
  return Room.find({}).then((rooms) => {
    if (!rooms) {
      return {
        status: true,
        message: "no room",
        rooms: null,
      };
    } else {
      return {
        status: true,
        message: "rooms success",
        rooms: rooms,
      };
    }
  });
};

exports.CreateRoom = async (req, res) => {
  const { name, userId } = req.body;
  const user = await getUser({ id: userId });

  let room = new Room({
    name: name,
    created_by: userId,
    users: [{ id: userId, username: user.userName }],
    musics: [],
    type: "public",
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

exports.CreateRoomSocket = async (name, userId) => {
  const user = await getUser({ id: userId });

  await Room.insertMany([
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
  const { roomName } = req.params;

  Room.findOne({ name: roomName }).exec((err, room) => {
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
        message: "room name exist",
        room: room,
      });
    }
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
      if (room.musics.length > 1) {
        room.musics = room?.musics?.sort((a, b) => b.nb_vote - a.nb_vote);
      }
      return res.json({
        status: true,
        message: "detail of room",
        room: room,
      });
    }
  });
};

exports.getRoomSocket = async (roomId) => {
  return Room.findOne({ _id: roomId }).then((room) => {
    if (!room) {
      return {
        status: true,
        message: "no room",
        room: null,
      };
    } else {
      if (room.musics.length > 1) {
        room.musics = room?.musics?.sort((a, b) => b.nb_vote - a.nb_vote);
      }
      return {
        status: true,
        message: "detail of room",
        room: room,
      };
    }
  });
};

exports.delRoom = async (req, res) => {
  const { userId, roomId } = req.params;
  console.log(userId, roomId);
  Room.findOne({
    $and: [{ _id: roomId }, { created_by: userId }],
  }).exec((err, room) => {
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
      Room.deleteOne({ _id: roomId }).exec((err) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
          });
        }
      });
      return res.json({
        status: true,
        message: "Room was delete",
      });
    }
  });
};

exports.delRoomSocket = async (userId, roomId) => {
  return Room.findOne({
    $and: [{ _id: roomId }, { created_by: userId }],
  }).then((room) => {
    if (!room) {
      return {
        status: false,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      return Room.deleteOne({ _id: roomId }).then(() => {
        return {
          status: true,
          message: "Room was delete",
        };
      });
    }
  });
};

exports.inviteToRoom = async (req, res) => {
  const { roomId, friendId } = req.params;
  const { userId } = req.body;
  console.log(friendId);

  Room.findOne({
    _id: roomId,
  }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
        room: null,
      });
    } else if (!room) {
      return res.json({
        status: true,
        message: "this room doesn't exist or you dont have the good right",
        room: null,
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
                room.invited?.length > 0 &&
                room.invited.find((el) => el.id === friendId)
              ) {
                return res.json({
                  status: false,
                  message: "this user is already in this room or invited",
                });
              } else if (
                friend.notifs !== undefined &&
                friend.notifs.room !== undefined &&
                friend.notifs.room.find((room) => room.id === roomId)
              ) {
                return res.json({
                  status: false,
                  message: "this user already invite you",
                });
              } else {
                User.updateOne(
                  { id: friendId },
                  {
                    $push: {
                      "notifs.rooms": {
                        id: roomId,
                        name: room.name,
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

exports.inviteToRoomSocket = async (roomId, userId, friendId) => {
  return Room.findOne({
    _id: roomId,
  }).then((room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
        room: null,
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
                room.invited?.length > 0 &&
                room.invited.find((el) => el.id === friendId)
              ) {
                return {
                  status: false,
                  message: "this user is already in this room or invited",
                };
              } else if (
                friend.notifs !== undefined &&
                friend.notifs.room !== undefined &&
                friend.notifs.room.find((room) => room.id === roomId)
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
                      "notifs.rooms": {
                        id: roomId,
                        name: room.name,
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

exports.acceptInviteRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

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
      Room.updateOne({ _id: roomId }, { $push: { invited: userId } }).exec(
        (err, room) => {
          if (err) {
            return res.json({
              status: false,
              message: err,
            });
          } else {
            User.updateOne(
              { id: userId },
              {
                notifs: {
                  $pull: {
                    rooms: {
                      id: roomId,
                    },
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
                  message: "you accept to enter in the room",
                });
              }
            });
          }
        }
      );
    }
  });
};

exports.acceptInviteRoomSocket = async (userId, roomId) => {
  return Room.findOne({ _id: roomId }).then((room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      Room.updateOne({ _id: roomId }, { $push: { invited: userId } }).then(
        (room) => {
          User.updateOne(
            { id: userId },
            {
              notifs: {
                $pull: {
                  rooms: {
                    id: roomId,
                  },
                },
              },
            }
          ).then((user) => {
            return {
              status: true,
              message: "you accept to enter in the room",
            };
          });
        }
      );
    }
  });
};

exports.enterRoom = async (req, res) => {
  const { roomId } = req.params;
  const { userId, deviceId } = req.body;

  const user = await getUser({ id: userId });

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
        { $pull: { users: { id: userId } } }
      ).exec((err, room) => {
        if (err) {
          return res.json({
            status: false,
            message: err,
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
    }
  });
};

exports.enterRoomSocket = async (userId, roomId, deviceId) => {
  const user = await getUser({ id: userId });
  console.log(roomId);

  return Room.findOne({ _id: roomId }).then((room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      return Room.updateOne(
        { _id: roomId },
        { $pull: { users: { id: userId } } }
      ).then((room) => {
        return Room.updateOne(
          { _id: roomId },
          {
            $push: {
              users: {
                id: userId,
                deviceId: deviceId,
                username: user.userName,
              },
            },
          }
        ).then((room) => {
          return {
            status: true,
            message: "you have enter this room",
          };
        });
      });
    }
  });
};

exports.stockPositionTrack = async (req, res) => {
  const { roomId } = req.params;
  const { progress_ms } = req.body;

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
          $set: {
            progress_ms: progress_ms,
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
            message: "you have stock the track's position in this room",
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
      if (roomIndex != -1 && room.created_by === userId) {
        // Room.deleteOne({ _id: roomId }).exec((err, room) => {
        //   if (err) {
        //     return res.json({
        //       status: false,
        //       message: err,
        //     });
        //   } else {
        // return res.json({
        //   status: true,
        //   message: "you have quit this room and delete this room",
        //   }
        // });
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
      } else if (roomIndex != -1) {
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

exports.quitRoomSocket = async (userId, roomId) => {
  return Room.findOne({ _id: roomId }).then((err, room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      let roomIndex = room.users
        .map((u) => {
          return u.id;
        })
        .indexOf(userId);
      if (roomIndex != -1 && room.created_by === userId) {
        // Room.deleteOne({ _id: roomId }).exec((err, room) => {
        //   if (err) {
        //     return res.json({
        //       status: false,
        //       message: err,
        //     });
        //   } else {
        // return res.json({
        //   status: true,
        //   message: "you have quit this room and delete this room",
        //   }
        // });
        return Room.updateOne(
          { _id: roomId },
          { $pull: { users: { id: userId } } }
        ).then((room) => {
          return {
            status: true,
            message: "you have quit this room",
          };
        });
      } else if (roomIndex != -1) {
        return Room.updateOne(
          { _id: roomId },
          { $pull: { users: { id: userId } } }
        ).then((room) => {
          return {
            status: true,
            message: "you have quit this room",
          };
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
  const { trackId, userId } = req.body;
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
              nb_vote: 1,
              vote: [userId],
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

exports.addMusicRoomSocket = async (roomId, userId, trackId) => {
  return Room.findOne({ _id: roomId }).then((room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      return Room.updateOne(
        { _id: roomId },
        {
          $addToSet: {
            musics: {
              trackId: trackId,
              duration: null,
              nb_vote: 1,
              vote: [userId],
            },
          },
        }
      ).then((room) => {
        return {
          status: true,
          message: "music add to the list",
        };
      });
    }
  });
};

exports.delMusicRoom = async (req, res) => {
  const { roomId, trackId } = req.params;
  const duration = req.body.duration;

  Room.findOne({ _id: roomId }).exec((err, room) => {
    if (err) {
      return res.status(400).json({
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
          return res.status(400).json({
            status: false,
            message: err,
          });
        } else {
          return res.status(200).json({
            status: true,
            room: room,
            message: "music remove to the list",
          });
        }
      });
    }
  });
};

exports.delMusicRoomSocket = async (roomId, trackId) => {
  return Room.findOne({ _id: roomId }).then((room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      return Room.updateOne(
        { _id: roomId },
        {
          $pull: {
            musics: {
              trackId: trackId,
            },
          },
        }
      ).then((room) => {
        return {
          status: true,
          room: room,
          message: "music remove to the list",
        };
      });
    }
  });
};

exports.voteMusicRoom = async (req, res) => {
  const { roomId, trackId } = req.params;
  const { userId } = req.body;

  Room.findOne({
    $and: [
      { _id: roomId },
      {
        $or: [
          { created_by: userId },
          { invited: { $in: [userId] } },
          { type: "public" },
        ],
      },
    ],
  }).exec(async (err, room) => {
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
      if (
        room.musics.find(
          (music) =>
            music.trackId === trackId &&
            music.vote.find((user) => user === userId) === undefined
        )
      ) {
        Room.updateOne(
          { _id: roomId, musics: { $elemMatch: { trackId: trackId } } },
          {
            $inc: { "musics.$.nb_vote": 1 },
            $push: { "musics.$.vote": userId },
          }
        ).exec(async (err, room) => {
          if (err) {
            return res.json({
              status: false,
              message: err,
            });
          } else {
            return res.json({
              status: true,
              message: "this music is vote",
            });
          }
        });
      } else if (room.musics.find((music) => music.trackId === trackId)) {
        return res.json({
          status: false,
          message: "this music already vote by you",
        });
      } else
        return res.json({
          status: false,
          message: "this music does not exist in this event",
        });
    }
  });
};

exports.voteMusicRoomSocket = async (roomId, userId, trackId) => {
  return Room.findOne({
    $and: [
      { _id: roomId },
      {
        $or: [
          { created_by: userId },
          { invited: { $in: [userId] } },
          { type: "public" },
        ],
      },
    ],
  }).then(async (room) => {
    if (!room) {
      return {
        status: true,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      if (
        room.musics.find(
          (music) =>
            music.trackId === trackId &&
            music.vote.find((user) => user === userId) === undefined
        )
      ) {
        return Room.updateOne(
          { _id: roomId, musics: { $elemMatch: { trackId: trackId } } },
          {
            $inc: { "musics.$.nb_vote": 1 },
            $push: { "musics.$.vote": userId },
          }
        ).then(async (room) => {
          return {
            status: true,
            message: "this music is vote",
          };
        });
      } else if (room.musics.find((music) => music.trackId === trackId)) {
        return {
          status: false,
          message: "this music already vote by you",
        };
      } else
        return {
          status: false,
          message: "this music does not exist in this event",
        };
    }
  });
};

exports.changeType = async (req, res) => {
  const { roomId } = req.params;
  const { type, userId } = req.body;

  Room.findOne({ _id: roomId, created_by: userId }).exec((err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!room) {
      return res.json({
        status: false,
        message: "this room doesn't exist or you dont have the good right",
      });
    } else {
      Room.updateOne(
        { _id: roomId },
        {
          type: type,
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
            message: "this room change type",
          });
        }
      });
    }
  });
};

exports.changeTypeSocket = async (userId, roomId, type) => {
  return Room.findOne({ _id: roomId, created_by: userId }).then((room) => {
    if (!room) {
      return {
        status: false,
        message: "this room doesn't exist or you dont have the good right",
      };
    } else {
      return Room.updateOne(
        { _id: roomId },
        {
          type: type,
        }
      ).then((room) => {
        return {
          status: true,
          message: "this room change type",
        };
      });
    }
  });
};

async function isInCirc(latitude, longitude, radius, center) {
  console.log(latitude, longitude, radius, center);
  return new Promise((res, rej) => {
    if (
      geolib.isPointWithinRadius(
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        {
          latitude: parseFloat(center.latitude),
          longitude: parseFloat(center.longitude),
        },
        radius
      ) === true
    ) {
      res(true);
    } else res(false);
  });
}

exports.checkLimitRoom = async (req, res) => {
  const { lat, long } = req.query;
  const { roomId } = req.params;

  Room.findOne({ _id: roomId }).exec(async (err, room) => {
    if (err) {
      return res.json({
        status: false,
        message: err,
      });
    } else if (!room) {
      return res.json({
        status: false,
        message: "this room doesn't exist or you dont have the good right",
      });
    } else {
      if (room?.limits) {
        const isIn = await checkLimits(lat, long, room.limits);
        if (isIn) {
          return res.json({
            status: true,
            isIn: isIn,
            message: "The user is in limit",
          });
        } else {
          return res.json({
            status: true,
            isIn: isIn,
            message: "The user isn't in limit",
          });
        }
      }
    }
  });
};

async function checkLimits(lat, lng, limits) {
  return new Promise(async (res, rej) => {
    var date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const current = hour.toString() + minutes.toString();
    const start = limits.start.replace(":", "");
    const end = limits.end.replace(":", "");
    if (
      start < current &&
      current < end &&
      (await isInCirc(lat, lng, limits.radius, limits.center)) === true
    )
      res(true);
    else res(false);
  });
}

exports.addGeoHours = async (data) => {
  return new Promise((res, rej) => {
    console.log(data);
    if (data && data.roomId && data.userId) {
      Room.findOne({ _id: data.roomId, created_by: data.userId }).exec(
        (err, room) => {
          if (err) {
            return res({
              status: false,
              message: err,
            });
          } else if (!room) {
            return res({
              status: false,
              message:
                "this room doesn't exist or you dont have the good right",
            });
          } else {
            let limits = {
              radius: data.radius,
              center: data.center,
              start: data.start,
              end: data.end,
            };
            Room.updateOne(
              { _id: data.roomId },
              {
                limits: limits,
              }
            ).exec(async (err, room) => {
              if (err) {
                return res({
                  status: false,
                  message: err,
                });
              } else {
                console.log(await checkLimits(0, 0, limits));
                return res({
                  status: true,
                  message: "this room change limits",
                  room: room,
                  roomId: data.roomId,
                });
              }
            });
          }
        }
      );
    }
  });
};
