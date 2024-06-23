const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const fetchChats = asyncHandler(async (req, res) => {
  try {
    var chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email photo",
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const accessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ message: "User ID required." });
    return;
  }
  var chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name email photo",
  });
  if (chat.length > 0) {
    res.status(200).send(chat[0]);
    return;
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const newChat = await Chat.create(chatData);
      const createdChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(createdChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

const createGroup = asyncHandler(async (req, res) => {
  const { usersList, name } = req.body;
  if (!usersList || !name) {
    res.status(400).json({ message: "Group name and users required." });
    return;
  }
  const users = JSON.parse(usersList);
  if (users.length < 2) {
    res
      .status(400)
      .json({ message: "Atleast 2 users are required to form a group." });
    return;
  }
  users.push(req.user);
  try {
    const newGroupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const createdGroupChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(createdGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newChatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newChatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (updatedChat) {
    res.status(200).json(updatedChat);
  } else {
    res.status(400).json({ message: "Group chat not found." });
  }
});

const addMemberToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const addToGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (addToGroup) {
    res.status(200).json(addToGroup);
  } else {
    res.status(400).json({ message: "Group chat not found." });
  }
});

const removeMemberFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removeFromGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (removeFromGroup) {
    res.status(200).json(removeFromGroup);
  } else {
    res.status(400).json({ message: "Group chat not found." });
  }
});

module.exports = {
  accessChats,
  fetchChats,
  createGroup,
  renameGroup,
  addMemberToGroup,
  removeMemberFromGroup,
};
