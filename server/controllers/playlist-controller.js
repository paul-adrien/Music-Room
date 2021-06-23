const db = require("../models");
const User = db.user;
const Playlist = db.playlist;

exports.getAllPlaylist = (req, res) => {
    const userId = req.params.userId;

    Playlist.find({ $or: [{ created_by: userId }, { users: { $in: [{ id: userId }] } }, { type: true }] })
        .exec((err, playlists) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    playlists: null
                });
            } else if (!playlists) {
                return res.json({
                    status: true,
                    message: 'no playlist',
                    playlists: null
                });
            } else {
                return res.json({
                    status: true,
                    message: 'list of playlist',
                    playlists: playlists
                });
            }
        })
}

exports.CreatePlaylist = async (req, res) => {
    const userId = req.params.userId;
    const { name, type, right, style } = req.body;

    let playlist = new Playlist({
        name: name,
        created_by: userId,
        users: null,
        musics: null,
        type: type,
        right: right,
        style: style
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
            message: 'playlist created',
            playlist: playlist
        });
    })
}

exports.getPlaylist = (req, res) => {
    const { userId, playlistId } = req.params;

    Playlist.findOne({ _id: playlistId })
        .exec((err, playlists) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    playlists: null
                });
            } else if (!playlists) {
                return res.json({
                    status: true,
                    message: 'no playlist',
                    playlists: null
                });
            } else {
                return res.json({
                    status: true,
                    message: 'detail of playlist',
                    playlists: playlists
                });
            }
        })
}

exports.delPlaylist = async (req, res) => {
    const { userId, playlistId } = req.params;

    Playlist.findOne({ $and: [{ _id: playlistId }, { $or: [{ created_by: userId }, { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } }] }] })
        .exec((err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right"
                });
            } else {
                Playlist.deleteOne({ _id: playlistId }).exec((err) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err
                        });
                    }
                });
                return res.json({
                    status: true,
                    message: 'playlist was delete',
                });
            }
        })
}

exports.editPlaylist = async (req, res) => {
    const { userId, playlistId } = req.params;
    const { name, type, right, style } = req.body;

    Playlist.findOne({ $and: [{ _id: playlistId }, { created_by: userId }] })
        .exec(async (err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    playlist: null
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right",
                    playlist: null
                });
            } else {
                let editPlaylist = {
                    name: name,
                    created_by: userId,
                    users: playlist.users,
                    musics: playlist.musics,
                    type: type,
                    right: right,
                    style: style
                };
                const finalPlaylist = await Playlist.updateOne({ _id: playlist._id }, { $set: editPlaylist }).exec();
                res.json({
                    status: true,
                    playlist: finalPlaylist,
                    message: 'playlist was changed'
                });
            }
        })
}

exports.inviteToPlaylist = async (req, res) => {
    const { userId, playlistId, friendId } = req.params;
    const right = req.body.right;

    Playlist.findOne({ $and: [{ _id: playlistId }, { created_by: userId }] })
        .exec((err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err,
                    playlist: null
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right",
                    playlist: null
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
                                if (friend.notifs !== undefined && friend.notifs.playlist !== undefined && friend.notifs.playlist.map((f) => { return f.id }).indexOf(playlistId) != -1)
                                    return res.json({
                                        status: false,
                                        message: "this user already invite you"
                                    });
                                if (playlist.users.map((e) => { return e.id }).indexOf(friendId) != -1)
                                    return res.json({
                                        status: false,
                                        message: "this useris already in this playlist"
                                    });
                                if (friend.notifs.playlist === undefined || friend.notifs.playlist.length == 0) {
                                    friend.notifs.playlist = {
                                        id: playlistId,
                                        right: right,
                                        date: Date.now()
                                    };
                                } else {
                                    await friend.notifs.playlist.push({
                                        id: playlistId,
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

exports.refuseInviteToPlaylist = async (req, res) => {
    const { userId, playlistId } = req.params;

    Playlist.findOne({ _id: playlistId })
        .exec((err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right"
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
                        let notifIndex = user.notifs.playlist.map(function (u) { console.log(u); return u.id; }).indexOf(playlistId);
                        if (notifIndex != -1) {
                            user.notifs.playlist.splice(notifIndex, 1);
                            let finalUser = new User(user);
                            finalUser.save((err, playlist) => {
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

exports.acceptInvitePlaylist = async (req, res) => {
    const { userId, playlistId } = req.params;

    Playlist.findOne({ _id: playlistId })
        .exec((err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right"
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
                        let notifIndex = user.notifs.playlist.map(function (u) { console.log(u); return u.id; }).indexOf(playlistId);
                        if (notifIndex != -1) {
                            if (playlist.users != null) {
                                playlist.users.push({
                                    id: userId,
                                    username: user.userName,
                                    right: user.notifs.playlist.right
                                });
                            } else
                                playlist.users = {
                                    id: userId,
                                    username: user.userName,
                                    right: user.notifs.playlist.right
                                };
                            let finalPlaylist = new Playlist(playlist);
                            finalPlaylist.save((err) => {
                                if (err) {
                                    return res.json({
                                        status: false,
                                        message: err
                                    });
                                } else
                                    user.notifs.playlist.splice(notifIndex, 1);
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

exports.quitPlaylist = async (req, res) => {
    const { userId, playlistId } = req.params;

    Playlist.findOne({ _id: playlistId })
        .exec((err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right"
                });
            } else {
                let playlistIndex = playlist.users.map((u) => { return u.id }).indexOf(userId);
                if (playlistIndex != -1) {
                    playlist.users.splice(playlistIndex, 1);
                    const finalPlaylist = new Playlist(playlist);
                    finalPlaylist.save();
                    return res.json({
                        status: true,
                        message: "you have quit this playlist"
                    });
                } else {
                    return res.json({
                        status: false,
                        message: "this user is not in this playlist"
                    });
                }
            }
        })
}

exports.addMusicPlaylist = async (req, res) => {
    const { userId, playlistId, trackId } = req.params;
    const duration = req.body.duration;

    Playlist.findOne({ $and: [{ _id: playlistId }, { $or: [{ created_by: userId }, { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } }] }] })
        .exec(async (err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right"
                });
            } else {
                if (playlist.musics === null) {
                    playlist.musics = {
                        trackId: trackId,
                        duration: duration
                    }
                } else {
                    playlist.musics.push({
                        trackId: trackId,
                        duration: duration
                    })
                }
                let editPlaylist = new Playlist(playlist);
                editPlaylist.save((err) => {
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

exports.delMusicPlaylist = async (req, res) => {
    const { userId, playlistId, trackId } = req.params;

    Playlist.findOne({ $and: [{ _id: playlistId }, { $or: [{ created_by: userId }, { users: { $in: [{ $and: [{ id: userId }, { right: true }] }] } }] }] })
        .exec((err, playlist) => {
            if (err) {
                return res.json({
                    status: false,
                    message: err
                });
            } else if (!playlist) {
                return res.json({
                    status: true,
                    message: "this playlist doesn't exist or you dont have the good right"
                });
            } else {
                let musicIndex = playlist.musics.map((m) => { return m.trackId }).indexOf(trackId);
                if (musicIndex != -1) {
                    playlist.musics.splice(musicIndex, 1);
                    const finalPlaylist = new Playlist(playlist);
                    finalPlaylist.save();
                    return res.json({
                        status: true,
                        message: "music delete"
                    });
                } else {
                    return res.json({
                        status: false,
                        message: "this music is not in this playlist"
                    });
                }
            }
        })
}

