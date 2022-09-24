const express = require("express");
const router = express.Router();

const {
  getform,
  getItems,
  getItem,
  getItemsArchived,
  createItem,
  deleteItem,
  updateItem,
  archiveItem,
} = require("../controllers/medical_branch.controller");

const { auth } = require("../lib/auth");

router.get("/form", auth, getform);
router.get("/list",auth, getItems);
router.get("/:id",auth, getItem);
router.post("/save",auth, createItem);
router.post("/update/:id",auth, updateItem);
router.get("/list/archived",auth, getItemsArchived);
router.post("/archive/:id",auth, archiveItem);
router.post("/delete/:id",auth, deleteItem);

module.exports = router;
