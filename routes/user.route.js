const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user.controller");

const { auth } = require("../lib/auth");

router.get("/generate/:tokenE", createUser);

module.exports = router;
