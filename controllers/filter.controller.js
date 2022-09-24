const FilterModel = require("../models/filter.model");
const UserModel = require("../models/user.model");
const filter = {};

filter.createItem = async (req, res) => {
  const { column, value } = req.body;
  try {
    const newFilter = new FilterModel({ column, value });
    await newFilter.save();
    const user = await UserModel.findById(req.user.user._id).lean();
    user.settings.filters.push(newFilter);
    await UserModel.findByIdAndUpdate(req.user.user._id, user);
    req.flash("success_msg", "Filtro creado correctamente.");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Error al crear filtro.");
  }
  res.redirect(req.get("referer"));
};

filter.deleteItem = async (req, res) => {
  const filterId = req.params.id;
  try {
    const user = await UserModel.findById(req.user.user._id).lean();
    console.log(user);
    user.settings.filters = user.settings.filters.filter((filter) => filter._id != filterId);
    await UserModel.findByIdAndUpdate(req.user.user._id, user);
    await FilterModel.findByIdAndDelete(filterId);
    req.flash("success_msg", "Filtro eliminado correctamente.");
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "Error al eliminar el filtro " + filterId);
  }

  res.redirect(req.get("referer"));
};

module.exports = filter;
