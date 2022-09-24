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
} = require("../controllers/employee.controller");

router.get("/form", auth, verifyPermission("create_employees"), getform);
router.get("/list", auth, verifyPermission("read_employees"), getItems);
router.get("/:id", auth, verifyPermission("read_employees"), getItem);
router.post("/save", auth, verifyPermission("create_employees"), createItem);
router.post("/update/:id", auth, verifyPermission("update_employees"), updateItem);
router.get("/list/archived", auth, verifyPermission("read_employees"), getItemsArchived);
router.post("/archive/:id", auth, verifyPermission("delete_employees"), archiveItem);
router.post("/delete/:id", auth, verifyPermission("delete_employees"), deleteItem);

module.exports = router;
