const express = require("express");
const router = express.Router();

const { dashboard } = require("../controllers/dashboard.controller");
const { auth, first_auth } = require("../lib/auth");

router.get("/", auth, first_auth);
router.get("/home", auth, dashboard);
module.exports = router;
