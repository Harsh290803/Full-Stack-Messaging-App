const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  fetchChats,
  accessChats,
  createGroup,
  renameGroup,
  addMemberToGroup,
  removeMemberFromGroup,
} = require("../controllers/chatControllers");
router = express.Router();

router.route("/").get(protect, fetchChats).post(protect, accessChats);
router.route("/group/create").post(protect, createGroup);
router.route("/group/rename").put(protect, renameGroup);
router.route("/group/addMember").put(protect, addMemberToGroup);
router.route("/group/removeMember").put(protect, removeMemberFromGroup);

module.exports = router;
