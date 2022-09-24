const UserModel = require("../models/user.model");
const Handlebars = require("handlebars");

Handlebars.registerHelper("calc-shortcut", function (list) {
  return -(list.length - 12);
});

const DashboardController = {};

DashboardController.dashboard = async (req, res) => {
  const settings = await UserModel.findById(req.user.user._id)
    .populate({
      path: "settings",
      populate: {
        path: "shortcuts",
      },
    })
    .lean();
  const shortcut_list = settings.settings.shortcuts;

  res.render("dashboard", { shortcut_list });
};

module.exports = DashboardController;
