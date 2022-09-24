const UserModel = require("../models/user.model");
const authorization = {};

authorization.verifyPermission = (permissionDate) => async (req, res, next) => {
  const user = await UserModel.findById(req.user.user._id).populate("role");
  if (user) {
    const role = await user.role.populate("permissions");
    if (role) {
      const permissions = await role.permissions;
      if (permissions) {
        const permissionFound = permissions.find(
          (permission) => permission.name === permissionDate
        );
        if (permissionFound) {
          next();
        } else {
          req.flash("error_401_msg", "No tienes permiso para acceder a esta página.");
          res.render("errors/401");
        }
      } else {
        req.flash("error_401_msg", "No tienes permisos para acceder a esta ruta.");
        res.render("errors/401");
      }
    } else {
      req.flash("error_401_msg", "No se encontró el rol de tu usuario.");
      res.render("errors/401");
    }
  } else {
    req.flash("error_401_msg", "Parece que no estas autenticado.");
    res.render("errors/401");
  }
};
module.exports = authorization;
