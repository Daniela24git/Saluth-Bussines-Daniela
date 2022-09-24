const ApplicationModel = require("../models/application.model"); 
const ShortcutModel = require("../models/shortcut.model"); 
const Handlebars = require("handlebars"); 

Handlebars.registerHelper("calc-shortcut", function (list) {
  return -(list.length - 12);
});

Handlebars.registerHelper("for", function (n, block) {
  var accum = "";
  for (var i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
});

const home = {};

home.dashboard = async (req, res) => {
  const aplications_list = await ApplicationModel.find({ name: "Saluth Business" }).lean();
  const shortcuts_list = await ShortcutModel.find({ archived: false }).lean();

  res.render("dashboard", { aplications_list, shortcuts_list });
};

module.exports = home;
