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
} = require("../controllers/permission.controller");

router.get("/form", auth, verifyPermission("read_permissions"), getform);
router.get("/list", auth, verifyPermission("read_permissions"), getItems);
router.get("/:id", auth, verifyPermission("read_permissions"), getItem);
router.post("/save", auth, verifyPermission("create_permissions"), createItem);
router.post("/update/:id", auth, verifyPermission("update_permissions"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_permissions"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_permissions"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_permissions"), deleteItem);

module.exports = router;
