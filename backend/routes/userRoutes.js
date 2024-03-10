const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUser,
  verifyUser,
  sendVerificationEmail,
  resendEmail,
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
router.route("/verify/:userId/:uniqueString").get(verifyUser);
router.route("/resend/email").post(resendEmail);
router.route("/verified").get((req, res) => {
  res.sendFile(path.join(__dirname, "../views/verified.html"));
});

module.exports = router;
