const ShortcutModel = require("../models/shortcut.model");
const shortcut = {};

shortcut.link = async (req, res) => {
  const name = req.params.name;
  await new ShortcutModel({ name, url: req.get("referer") }).save();
  req.flash("success_msg", "Módulo anclado correctamente en accesos directos.");
  res.redirect(req.get("referer"));
};

shortcut.unlink = async (req, res) => {
  const id = req.params.id;
  await ShortcutModel.findByIdAndDelete(id);
  req.flash("success_msg", "Módulo desanclado correctamente de accesos directos.");
  res.redirect(req.get("referer"));
};

module.exports = shortcut;
