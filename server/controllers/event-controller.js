const db = require("../models");
const User = db.user;
const Event = db.event;

exports.getAllEvent = (req, res) => {
    const userId = req.params.userId;

    Event.find({ $or: [{ created_by: userId }, { users: { $in: [{ id: userId }] } }, { type: true }] })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    event: null
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: 'no event',
                    event: null
                });
            } else {
                return res.json({
                    status: true,
                    message: 'list of event',
                    event: event
                });
            }
        })
}

exports.CreateEvent = async (req, res) => {
    const userId = req.params.userId;
    const { name, type, start, end, lat, lng, vote_right, style } = req.body;

    let event = new Event({
        name: name,
        created_by: userId,
        status: null,
        start_date: start,
        start_end: end,
        location: {
            lat: lat,
            lng: lng
        },
        vote_right: vote_right,
        users: null,
        musics: null,
        type: type,
        style: style
    });
    event.save((err, event) => {
        if (err) {
            return res.json({
                status: false,
                message: err,
            });
        }
        res.json({
            status: true,
            message: 'event created',
            event: event
        });
    })
}

exports.getEvent = (req, res) => {
    const { userId, eventId } = req.params;

    Event.findOne({ _id: eventId })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    event: null
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: 'no event',
                    event: null
                });
            } else {
                return res.json({
                    status: true,
                    message: 'detail of event',
                    event: event
                });
            }
        })
}

exports.delEvent = async (req, res) => {
    const { userId, eventId } = req.params;

    Event.findOne({ $and: [{ _id: eventId }, { $or: [{ created_by: userId }, { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } }] }] })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right"
                });
            } else {
                Event.deleteOne({ _id: eventId }).exec((err) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err
                        });
                    }
                });
                return res.json({
                    status: true,
                    message: 'event was delete',
                });
            }
        })
}

exports.editEvent = async (req, res) => {
    const { userId, eventId } = req.params;
    const { name, type, start, end, lat, lng, vote_right, style } = req.body;

    Event.findOne({ $and: [{ _id: eventId }, { created_by: userId }] })
        .exec(async (err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    event: null
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right",
                    event: null
                });
            } else {
                let editEvent = {
                    name: name,
                    created_by: userId,
                    status: null,
                    start_date: start,
                    start_end: end,
                    location: {
                        lat: lat,
                        lng: lng
                    },
                    vote_right: vote_right,
                    users: event.users,
                    musics: event.musics,
                    type: type,
                    style: style
                };
                const finalEvent = await Event.updateOne({ _id: event._id }, { $set: editEvent }).exec();
                res.json({
                    status: true,
                    event: finalEvent,
                    message: 'event was changed'
                });
            }
        })
}

exports.addMusicEvent = async (req, res) => {
    const { userId, eventId, trackId } = req.params;
    const duration = req.body.duration;

    Event.findOne({ $and: [{ _id: eventId }, { $or: [{ created_by: userId }, { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } }] }] })
        .exec(async (err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right"
                });
            } else {
                if (event.musics === null) {
                    event.musics = {
                        trackId: trackId,
                        duration: duration,
                        nb_vote: 0,
                        vote: []
                    }
                } else {
                    event.musics.push({
                        trackId: trackId,
                        duration: duration,
                        nb_vote: 0,
                        vote: []
                    })
                }
                let editEvent = new Event(event);
                editEvent.save((err) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err
                        });
                    } else
                        return res.json({
                            status: true,
                            message: "music save"
                        });
                })
            }
        })
}

exports.delMusicEvent = async (req, res) => {
    const { userId, eventId, trackId } = req.params;

    Event.findOne({ $and: [{ _id: eventId }, { $or: [{ created_by: userId }, { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } }] }] })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right"
                });
            } else {
                let musicIndex = event.musics.map((m) => { return m.trackId }).indexOf(trackId);
                if (musicIndex != -1) {
                    event.musics.splice(musicIndex, 1);
                    const finalEvent = new Event(event);
                    finalEvent.save();
                    return res.json({
                        status: true,
                        message: "music delete"
                    });
                } else {
                    return res.json({
                        status: false,
                        message: "this music is not in this event"
                    });
                }
            }
        })
}

exports.inviteToEvent = async (req, res) => {
    const { userId, eventId, friendId } = req.params;
    const right = req.body.right;

    Event.findOne({ $and: [{ _id: eventId }, { created_by: userId }] })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    event: null
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right",
                    event: null
                });
            } else {
                User.findOne({ id: userId }).exec(async (err, user) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err
                        });
                    } else if (!user) {
                        return res.json({
                            status: false,
                            message: "this user doesn't exist"
                        });
                    } else {
                        User.findOne({ id: friendId }).exec(async (err, friend) => {
                            if (err) {
                                return res.json({
                                    status: false,
                                    message: err
                                });
                            } else if (!friend) {
                                return res.json({
                                    status: false,
                                    message: "this friend doesn't exist"
                                });
                            } else {
                                if (friend.notifs !== undefined && friend.notifs.events !== undefined && friend.notifs.events.map((f) => { return f.id }).indexOf(eventId) != -1)
                                    return res.json({
                                        status: false,
                                        message: "this user already invite you"
                                    });
                                if (event.users.map((e) => { return e.id }).indexOf(friendId) != -1)
                                    return res.json({
                                        status: false,
                                        message: "this useris already in this event"
                                    });
                                if (friend.notifs.events === undefined || friend.notifs.events.length == 0) {
                                    friend.notifs.events = {
                                        id: eventId,
                                        right: right,
                                        date: Date.now()
                                    };
                                } else {
                                    await friend.notifs.events.push({
                                        id: eventId,
                                        right: right,
                                        date: Date.now()
                                    });
                                }
                                console.log(friend)
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
                                            message: "invitation was send"
                                        });
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
}

exports.refuseInviteToEvent = async (req, res) => {
    const { userId, eventId } = req.params;

    Event.findOne({ _id: eventId })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right"
                });
            } else {
                User.findOne({ id: userId }).exec(async (err, user) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err
                        });
                    } else if (!user) {
                        return res.json({
                            status: false,
                            message: "this user doesn't exist"
                        });
                    } else {
                        let notifIndex = user.notifs.events.map(function (u) { console.log(u); return u.id; }).indexOf(eventId);
                        if (notifIndex != -1) {
                            user.notifs.events.splice(notifIndex, 1);
                            let finalUser = new User(user);
                            finalUser.save((err, event) => {
                                if (err) {
                                    return res.json({
                                        status: false,
                                        message: err
                                    });
                                } else
                                    return res.json({
                                        status: true,
                                        message: "invitation delete"
                                    });
                            });
                        } else {
                            return res.json({
                                status: false,
                                message: "you dont have invitation by this user"
                            });
                        }
                    }
                })
            }
        })
}

exports.acceptInviteEvent = async (req, res) => {
    const { userId, eventId } = req.params;

    Event.findOne({ _id: eventId })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right"
                });
            } else {
                User.findOne({ id: userId }).exec(async (err, user) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err
                        });
                    } else if (!user) {
                        return res.json({
                            status: false,
                            message: "this user doesn't exist"
                        });
                    } else {
                        let notifIndex = user.notifs.events.map(function (u) { console.log(u); return u.id; }).indexOf(eventId);
                        if (notifIndex != -1) {
                            if (event.users != null) {
                                event.users.push({
                                    id: userId,
                                    username: user.userName,
                                    right: user.notifs.events.right
                                });
                            } else
                                event.users = {
                                    id: userId,
                                    username: user.userName,
                                    right: user.notifs.events.right
                                };
                            let finalEvent = new Event(event);
                            finalEvent.save((err) => {
                                if (err) {
                                    return res.json({
                                        status: false,
                                        message: err
                                    });
                                } else
                                    user.notifs.events.splice(notifIndex, 1);
                                let finalUser = new User(user);
                                finalUser.save();
                                return res.json({
                                    status: true,
                                    message: "invitation was accepted"
                                });
                            })
                        } else {
                            return res.json({
                                status: false,
                                message: "you dont have invitation by this user"
                            });
                        }
                    }
                })
            }
        })
}

exports.quitEvent = async (req, res) => {
    const { userId, eventId } = req.params;

    Event.findOne({ _id: eventId })
        .exec((err, event) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!event) {
                return res.json({
                    status: true,
                    message: "this event doesn't exist or you dont have the good right"
                });
            } else {
                let eventIndex = event.users.map((u) => { return u.id }).indexOf(userId);
                if (eventIndex != -1) {
                    event.users.splice(eventIndex, 1);
                    const finalEvent = new Event(event);
                    finalEvent.save();
                    return res.json({
                        status: true,
                        message: "you have quit this event"
                    });
                } else {
                    return res.json({
                        status: false,
                        message: "this user is not in this event"
                    });
                }
            }
        })
}