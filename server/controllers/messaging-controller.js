const { conversation } = require(appRoot + "/models");
const db = require(appRoot + "/models");
const Conversation = db.conversation;
var datefns = require("date-fns");

exports.getConversationList = (req, res, next) => {
  const { userId } = req.params;

  Conversation.find({ "users.userId": userId })
    .sort({ last_updated: -1 })
    .exec((err, conversations) => {
      if (err) {
        res.message = err;
        res.status(400).json({
          status: false,
          message: err,
          conversations: null,
        });
      } else if (!conversations) {
        res.message = "no conversation";
        res.status(201).json({
          status: true,
          message: "no conversation",
          conversations: null,
        });
      } else {
        res.message = "list of conversations";
        res.status(200).json({
          status: true,
          message: "list of conversations",
          conversations: conversations,
        });
      }
      next();
    });
};

exports.getConversationDetail = (req, res, next) => {
  const { userId, conversationId } = req.params;

  Conversation.findOne({
    $and: [{ "users.userId": userId }, { _id: conversationId }],
  }).exec((err, conversation) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
        conversation: null,
      });
    } else if (!conversation) {
      res.message = "no conversation";
      res.status(201).json({
        status: true,
        message: "no conversation",
        conversation: null,
      });
    } else {
      let conv = conversation;
      conv.messages = conversation?.messages?.sort((a, b) => {
        if (datefns.isBefore(new Date(a.date), new Date(b.date))) {
          return -1;
        } else if (datefns.isAfter(new Date(a.date), new Date(b.date))) {
          return 1;
        } else {
          return 0;
        }
      });
      res.message = "conversation detail";
      res.status(200).json({
        status: true,
        message: "conversation detail",
        conversation: conv,
      });
    }
    next();
  });
};

exports.getConversationDetailSocket = (userId, conversationId) => {
  return Conversation.findOne({
    $and: [{ "users.userId": userId }, { _id: conversationId }],
  }).then((conversation) => {
    
    if (!conversation) {
      return {
        status: false,
        message: "no conversation",
        conversation: null,
      };
    } else {
      return {
        status: true,
        message: "conversation detail",
        conversation: conversation,
      };
    }
  });
};

exports.getConversationByNameSocket = async (userId, name) => {
  return Conversation.findOne({
    $and: [{ "users.userId": userId }, { name: name }],
  }).then((conversation) => {
    if (!conversation) {
      return {
        status: false,
        message: "no conversation",
        conversation: null,
      };
    } else {
      return conversation;
    }
  });
};

exports.createConversation = (req, res, next) => {
  const { userId } = req.params;
  const { name, users } = req.body;

  var conv = new Conversation({
    name: name,
    users: users,
    messages: [],
    last_updated: Date.now(),
  });
  conv.save((err, conv) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
      });
    } else {
      res.message = "Conversation created";
      res.status(200).json({
        status: true,
        message: "Conversation created",
        Conv: conv,
      });
    }
    next();
  });
};

exports.createConversationSocket = async (name, users) => {
  return Conversation.insertMany([
    {
      name: name,
      users: users,
      messages: [],
      last_updated: Date.now(),
    },
  ]).then((conv) => {
    if (conv) {
      return {
        status: true,
        message: "Conversation created",
      };
    } else {
      return {
        status: false,
        message: "Conversation not created",
      };
    }
  });
};

exports.updateConversation = (req, res, next) => {
  const { userId, conversationId } = req.params;
  const { name, users } = req.body;

  Conversation.findOne({
    $and: [{ "users.userId": userId }, { _id: conversationId }],
  }).exec(async (err, conversation) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
        conversation: null,
      });
    } else if (!conversation) {
      res.message = "no conversation";
      res.status(201).json({
        status: true,
        message: "no conversation",
        conversation: null,
      });
    } else {
      if (users && users.length > 0) {
        newUsers = conversation.users.concat(users);
      } else newUsers = conversation.users;
      let updateConversation = {
        name: name,
        users: newUsers,
        last_updated: Date.now(),
      };
      const finalConv = await Conversation.updateOne(
        { _id: conversation._id },
        { $set: updateConversation }
      ).exec();
      res.message = "conversation was changed";
      res.status(200).json({
        status: true,
        conversation: finalConv,
        message: "conversation was changed",
      });
    }
    next();
  });
};

exports.deleteConversation = (req, res, next) => {
  const { userId, conversationId } = req.params;

  Conversation.findOne({
    $and: [{ "users.userId": userId }, { _id: conversationId }],
  }).exec(async (err, conversation) => {
    if (err) {
      res.message = err;
      res.status(400).json({
        status: false,
        message: err,
      });
    } else if (!conversation) {
      res.message = "no conversation";
      res.status(201).json({
        status: true,
        message: "no conversation",
      });
    } else {
      Conversation.deleteOne({ _id: conversation._id }).exec((err) => {
        if (err) {
          res.message = err;
          res.status(400).json({
            status: false,
            message: err,
          });
        }
      });
      res.message = "conversation was delete";
      res.status(200).json({
        status: true,
        message: "conversation was delete",
      });
    }
    next();
  });
};

exports.sendMessage = async (userId, conversationId, message) => {
  return Conversation.updateOne(
    {
      $and: [{ "users.userId": userId }, { _id: conversationId }],
    },
    {
      $push: {
        messages: {
          userId: userId,
          message: message,
          date: Date.now(),
        },
      },
      $set: {
        last_updated: Date.now(),
      },
    }
  ).then(async (conversation) => {
    if (!conversation) {
      return {
        
        status: false,
        message: "message not send",
      };
    } else {
      return {
        status: true,
        message: "message send",
      };
    }
  });
};
