const User = require(appRoot + "/models/users.model");

const getUser = async function (query) {
  if (query !== null) {
    const user = await User.findOne(query).exec();
    return user;
  } else return null;
};

const getUsers = async function (query) {
  if (query !== null) {
    const users = await User.find(query).exec();
    return users;
  } else return null;
};

const checkUserExist = async function (userId, type) {
  if (userId === null) {
    return false;
  }
  let user;
  if (type === "google") {
    user = await User.findOne({
      $or: [
        {
          id: userId,
        },
        { "google_account.id": userId },
      ],
    }).exec();
  } else {
    user = await User.findOne({
      id: userId,
    }).exec();
  }
  return !!user;
};

const updateUser = async function (userId, user) {
  const res = await User.updateOne({ id: userId }, { $set: user }).exec();
  return res;
};

module.exports = { checkUserExist, getUser, updateUser, getUsers };
