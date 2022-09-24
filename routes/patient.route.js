const express = require("express");
const router = express.Router();

const {
  getItems,
  getItemsArchived,
  archiveItem,
} = require("../controllers/patient.controller");

const { auth } = require("../lib/auth");

router.get("/list",auth, getItems);
router.get("/list/:id",auth, getItems);
router.get("/list/archived",auth, getItemsArchived);
router.post("/archive/:id",auth, archiveItem);

module.exports = router;
