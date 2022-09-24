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
} = require("../controllers/schedule.controller");

router.get("/form", auth, verifyPermission("read_schedules"), getform);
router.get("/list", auth, verifyPermission("read_schedules"), getItems);
router.get("/:id", auth, verifyPermission("read_schedules"), getItem);
router.post("/save", auth, verifyPermission("create_schedules"), createItem);
router.post("/update/:id", auth, verifyPermission("update_schedules"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_schedules"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_schedules"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_schedules"), deleteItem);

module.exports = router;
