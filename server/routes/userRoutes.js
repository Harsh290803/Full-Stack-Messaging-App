const express = require("express");
const {
  registerUser,
  authUser,
  searchUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(authUser);
router.route("/searchUsers").get(protect, searchUsers);

module.exports = router;
