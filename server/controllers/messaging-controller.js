const { conversation } = require(appRoot + "/models");
const db = require(appRoot + "/models");
const Conversation = db.conversation;

exports.getConversationList = (req, res, next) => {
    const { userId } = req.params;

    Conversation.find({ "users.userId": userId }).sort({ last_updated: -1 })
        .exec((err, conversations) => {
            if (err) {
                res.message = err;
                res.status(400).json({
                    status: false,
                    message: err,
                    conversations: null
                });
            } else if (!conversations) {
                res.message = 'no conversation';
                res.status(201).json({
                    status: true,
                    message: 'no conversation',
                    conversations: null
                });
            } else {
                res.message = 'list of conversations';
                res.status(200).json({
                    status: true,
                    message: 'list of conversations',
                    conversations: conversations
                });
            }
            next();
        })
}

exports.getConversationDetail = (req, res) => {
    const { userId, conversationId } = req.params;

    Conversation.find({ $and: [{ "users.userId": userId }, { _id: conversationId }] })
        .exec((err, conversation) => {
            if (err) {
                res.message = err;
                res.status(400).json({
                    status: false,
                    message: err,
                    conversation: null
                });
            } else if (!conversation) {
                res.message = 'no conversation';
                res.status(201).json({
                    status: true,
                    message: 'no conversation',
                    conversation: null
                });
            } else {
                res.message = 'conversation detail';
                res.status(200).json({
                    status: true,
                    message: 'conversation detail',
                    conversation: conversation
                });
            }
        })
}

exports.createConversation = (req, res) => {
    const { userId } = req.params;
    const { name, users } = req.body;

    console.log('test');
    var conv = new Conversation({
        name: name,
        users: users,
        messages: [],
        last_updated: Date.now()
    });
    conv.save((err, conv) => {
        if (err) {
            res.message = err;
            res.status(400).json({
                status: false,
                message: err,
            });
        } else {
            res.message = 'Conversation created';
            res.status(200).json({
                status: true,
                message: 'Conversation created',
                Conv: conv
            });
        }
    })
}

exports.updateConversation = (req, res) => {
    const { userId, conversationId } = req.params;
    const { name, users } = req.body;

    Conversation.findOne({ $and: [{ "users.userId": userId }, { _id: conversationId }] })
        .exec(async (err, conversation) => {
            if (err) {
                res.message = err;
                res.status(400).json({
                    status: false,
                    message: err,
                    conversation: null
                });
            } else if (!conversation) {
                res.message = 'no conversation';
                res.status(201).json({
                    status: true,
                    message: 'no conversation',
                    conversation: null
                });
            } else {
                if (users && users.length > 0) {
                    newUsers = conversation.users.concat(users);
                } else
                    newUsers = conversation.users;
                let updateConversation = {
                    name: name,
                    users: newUsers,
                    last_updated: Date.now()
                }
                const finalConv = await Conversation.updateOne({ _id: conversation._id }, { $set: updateConversation }).exec();
                res.message = 'conversation was changed';
                res.status(200).json({
                    status: true,
                    conversation: finalConv,
                    message: 'conversation was changed'
                });
            }
        })
}

exports.deleteConversation = (req, res) => {
    const { userId, conversationId } = req.params;

    Conversation.findOne({ $and: [{ "users.userId": userId }, { _id: conversationId }] })
        .exec(async (err, conversation) => {
            if (err) {
                res.message = err;
                res.status(400).json({
                    status: false,
                    message: err
                });
            } else if (!conversation) {
                res.message = 'no conversation';
                res.status(201).json({
                    status: true,
                    message: 'no conversation'
                });
            } else {
                Conversation.deleteOne({ _id: conversation._id }).exec((err) => {
                    if (err) {
                        return res.json({
                            status: false,
                            message: err,
                        });
                    }
                });
                return res.json({
                    status: true,
                    message: "conversation was delete",
                });
            }
        })
}

exports.sendMessage = (userId, conversationId, message) => {
    Conversation.findOne({ $and: [{ "users.userId": userId }, { _id: conversationId }] })
        .exec(async (err, conversation) => {
            if (err) {
                return;
            } else if (!conversation) {
                return;
            } else {
                await conversation.messages.push({
                    userId: userId,
                    message: message,
                    date: Date.now()
                });
                let updateConversation = {
                    messages: conversation.messages,
                    last_updated: Date.now()
                }
                const finalConv = await Conversation.updateOne({ _id: conversation._id }, { $set: updateConversation }).exec();
            }
        })
}