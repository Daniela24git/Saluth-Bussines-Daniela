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
} = require("../controllers/area.controller");

router.get("/form", auth, verifyPermission("create_areas"), getform);
router.get("/list", auth, verifyPermission("read_areas"), getItems);
router.get("/:id", auth, verifyPermission("read_areas"), getItem);
router.post("/save", auth, verifyPermission("create_areas"), createItem);
router.post("/update/:id", auth, verifyPermission("update_areas"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_areas"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_areas"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_areas"), deleteItem);

module.exports = router;
