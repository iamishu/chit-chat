const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUser,
  verifyUser,
  resendEmail,
  fetchAllFriends,
  fetchAllUserData,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const path = require("path");

const router = express.Router();

router
  .route("/")
  .post(registerUser)
  .get(protect, allUsers)
  .put(protect, updateUser);
router.route("/login").post(authUser);
router.route("/getfriends").get(protect, fetchAllFriends);
router.route("/getall").get(protect, fetchAllUserData);
router.route("/verify/:userId/:uniqueString").get(verifyUser);
router.route("/resend/email").post(resendEmail);
router.route("/verified").get((req, res) => {
  res.sendFile(path.join(__dirname, "../views/verified.html"));
});

module.exports = router;
