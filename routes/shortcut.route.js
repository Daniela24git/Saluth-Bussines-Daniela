const express = require('express');
const router = express.Router();

const { link, unlink } = require("../controllers/shortcut.controller");

router.get("/link/:name", link);
router.get("/unlink/:id", unlink);

module.exports = router;