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
} = require("../controllers/role.controller");

router.get("/form", auth, verifyPermission("read_roles"), getform);
router.get("/list", auth, verifyPermission("read_roles"), getItems);
router.get("/:id", auth, verifyPermission("read_roles"), getItem);
router.post("/save", auth, verifyPermission("create_roles"), createItem);
router.post("/update/:id", auth, verifyPermission("update_roles"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_roles"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_roles"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_roles"), deleteItem);

module.exports = router;
