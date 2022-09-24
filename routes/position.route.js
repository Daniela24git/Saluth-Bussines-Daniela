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
} = require("../controllers/position.controller");

router.get("/form", auth, verifyPermission("create_positions"), getform);
router.get("/list", auth, verifyPermission("read_positions"), getItems);
router.get("/:id", auth, verifyPermission("read_positions"), getItem);
router.post("/save", auth, verifyPermission("create_positions"), createItem);
router.post("/update/:id", auth, verifyPermission("update_positions"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_positions"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_positions"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_positions"), deleteItem);

module.exports = router;
