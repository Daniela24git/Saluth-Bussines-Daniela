const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/authentication");
const { verifyPermission } = require("../middlewares/authorization");
const {
  getform,
  getItems,
  getItem,
  getItemsArchived,
  createItem,
  deleteItem,
  updateItem,
  archiveItem,
} = require("../controllers/department.controller");

router.get("/form", auth, verifyPermission("read_departments"), getform);
router.get("/list", auth, verifyPermission("read_departments"), getItems);
router.get("/:id", auth, verifyPermission("read_departments"), getItem);
router.post("/save", auth, verifyPermission("create_departments"), createItem);
router.post("/update/:id", auth, verifyPermission("update_departments"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_departments"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_departments"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_departments"), deleteItem);

module.exports = router;
