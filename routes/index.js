const express = require("express");
const router = express.Router();
const fs = require("fs");

const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
  return fileName.split(".route.").shift();
};

const listfiles = fs.readdirSync(pathRouter).filter((file) => {
  const fileWithoutExtension = removeExtension(file);
  const skip = ["index.js"].includes(fileWithoutExtension);
  if (!skip) {
    return router.use(`/${fileWithoutExtension}`, require(`./${fileWithoutExtension}.route`));
  }
});

router.get("*", (req, res) => {
  res.status(404).render("errors/404", { title404: "404" });
});

module.exports = router;
