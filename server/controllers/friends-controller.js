const db = require("../models");
const User = db.user;

async function getUserInfo(user) {
}

exports.getFriendsList = (req, res) => {
    const { userId } = req.params;

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
            if (user.friends !== undefined && user.friends.length > 0) {
                i = 0;
                l = user.friends.length;
                let friends = [];
                user.friends.map((friend) => {
                    User.findOne({ id: friend.id }).exec((err, friendInfo) => {
                        if (err) {
                            return res.json({
                                status: false,
                                message: err
                            });
                        } else if (!friendInfo) {
                            return res.json({
                                status: false,
                                message: "this friend doesn't exist"
                            });
                        } else {
                            i++;
                            friends.push({ id: friendInfo.id, userName: friendInfo.userName });
                        }
                        console.log(friends)
                        if (i == l)
                            return res.json({
                                status: true,
                                friends: friends
                            });
                    })
                })
            } else {
                return res.json({
                    status: true,
                    friends: null
                });
            }
        }
    })
}

exports.deleteFriend = (req, res) => {
    const { userId, friendId } = req.params;

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
                } else if (!user) {
                    return res.json({
                        status: false,
                        message: "this friend doesn't exist"
                    });
                } else {
                    let indexFriend = friend.friends.map((u) => { return u.id }).indexOf(userId);
                    let indexUser = user.friends.map((u) => { return u.id }).indexOf(friendId);
                    if (indexFriend != -1 && indexUser != -1) {
                        user.friends.splice(indexUser, 1);
                        const finalUser = new User(user);
                        finalUser.save();
                        friend.friends.splice(indexFriend, 1);
                        const finalFriend = new User(friend);
                        finalFriend.save();
                        return res.json({
                            status: true
                        });
                    } else {
                        return res.json({
                            status: false,
                            message: "this user is not your friend"
                        });
                    }
                }
            })
        }
    })
}

exports.inviteFriend = (req, res) => {
    const { userId, friendId } = req.params;

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
                    if (user.notifs !== undefined && user.notifs.friends !== undefined && user.notifs.friends.map((f) => { return f.id }).indexOf(friendId) != -1)
                        return res.json({
                            status: false,
                            message: "already sending invite"
                        });
                    if (friend.notifs !== undefined && friend.notifs.friends !== undefined && friend.notifs.friends.map((f) => { return f.id }).indexOf(userId) != -1)
                        return res.json({
                            status: false,
                            message: "this user already invite you"
                        });
                    if (friend.notifs.friends === undefined || friend.notifs.friends.length == 0) {
                        friend.notifs.friends = {
                            id: userId,
                            date: Date.now()
                        };
                    } else {
                        await friend.notifs.friends.push({
                            id: userId,
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

exports.acceptInvitation = (req, res) => {
    const { userId, friendId } = req.params;

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
                    console.log(user, friend);
                    let friendIndex = user.notifs.friends.map(function (u) { console.log(u); return u.id; }).indexOf(friendId);
                    if (friendIndex != -1) {
                        user.friends.push({
                            id: friendId
                        });
                        friend.friends.push({
                            id: userId
                        });
                        user.notifs.friends.splice(friendIndex, 1);
                        finalUser = new User(user);
                        finalFriend = new User(friend);
                        finalFriend.save();
                        finalUser.save();
                        return res.json({
                            status: true,
                            message: "you have a new friend !"
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

exports.refuseInvitation = (req, res) => {
    const { userId, friendId } = req.params;

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
                } else if (!user) {
                    return res.json({
                        status: false,
                        message: "this friend doesn't exist"
                    });
                } else {
                    let notifIndex = user.notifs.friends.map(function (u) { console.log(u); return u.id; }).indexOf(friendId);
                    if (notifIndex != -1) {
                        user.notifs.friends.splice(notifIndex, 1);
                        finalUser = new User(user);
                        finalUser.save();
                        return res.json({
                            status: true,
                            message: "invitation delete"
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