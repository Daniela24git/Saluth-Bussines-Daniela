const express = require("express");
const router = express.Router();

const { not_auth } = require("../middlewares/authentication");
const {
  viewSignin,
  signin,
  signout,
  viewVerifyEmail,
  sendResetEmail,
  viewEmailSent,
  viewResetPassword,
  resetPassword,
} = require("../controllers/auth.controller");

router.get("/signin", not_auth, viewSignin);
router.post("/signin", signin);
router.get("/signout", signout);

router.get("/password_reset", not_auth, viewVerifyEmail);
router.post("/password_reset/email", not_auth, sendResetEmail);
router.post("/password_reset/email/:token", not_auth, sendResetEmail);
router.get("/password_reset/email_sent/:token", not_auth, viewEmailSent);
router.get("/password_reset/:token", not_auth, viewResetPassword);
router.post("/password_reset/:token", not_auth, resetPassword);

module.exports = router;
