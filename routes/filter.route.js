const express = require("express");
const router = express.Router();

const {
  createItem,
  deleteItem,
} = require("../controllers/filter.controller");

const { auth } = require("../lib/auth");
router.post("/save",auth, createItem);
router.get("/delete/:id",auth, deleteItem);

module.exports = router;
