const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/authentication");
const {
  getFormGeneral,
  getFormSecurity,
  updatePerson,
  updateUser,
} = require("../controllers/profile.controller");

router.get("/general", auth, getFormGeneral);
router.get("/security", auth, getFormSecurity);
router.post("/update/person/:id", auth, updatePerson);
router.post("/update/user/:id", auth, updateUser);

module.exports = router;
