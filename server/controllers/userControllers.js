const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!name || !email || !password) {
    res
      .status(400)
      .json({ message: "Please provide name, email and password." });
    return;
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res
      .status(400)
      .json({ message: "User with the given email address already exists." });
    return;
  }
  const user = await User.create({ name, email, password, photo });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Sign up failed." });
    return;
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please provide email and password." });
    return;
  }
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const keyword = req.query.search;
  if (keyword) {
    const searchQuery = {
      $or: [
        { name: { $regex: `^${keyword}`, $options: "i" } },
        { email: { $regex: `^${keyword}`, $options: "i" } },
      ],
    };
    const users = await User.find(searchQuery).find({ _id: { $ne: userId } });
    res.status(200).send(users);
  }
});

module.exports = { registerUser, authUser, searchUsers };
