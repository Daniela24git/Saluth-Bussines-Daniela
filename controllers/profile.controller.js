const ImageModel = require("../models/image.model");
const EmployeeModel = require("../models/employee.model");
const PersonModel = require("../models/person.model");
const UserModel = require("../models/user.model");

const {comparePassword, encryptPassword} = require("../helpers/handleBcrypt");

const ProfileController = {};

ProfileController.getFormGeneral = async (req, res) => {
  const person = await PersonModel.findById(req.user.person._id).lean();
  res.render("users/profile/general", { person });
};

ProfileController.getFormSecurity = async (req, res) => {
  const person = await PersonModel.findById(req.user.person._id).lean();
  const user = await UserModel.findById(req.user.user._id).populate("role").lean();
  res.render("users/profile/security", { user, person });
};

ProfileController.updatePerson = async (req, res) => {
  const person = req.params.id;
  const { identification, names, surnames, birthday, direction, phone, province, canton, parish } =
    req.body;
  try {
    await PersonModel.findByIdAndUpdate(person, {
      identification,
      names,
      surnames,
      birthday,
      direction,
      phone,
      province,
      canton,
      parish,
    });

    if (req.file) {
      const { filename, originalname, mimetype, size } = req.file;
      try {
        const avatar = await ImageModel.create({
          filename,
          path: "/img/uploads/" + filename,
          originalname,
          mimetype,
          size,
        });
        const employee = await EmployeeModel.findOne({ person }).lean();
        await UserModel.findByIdAndUpdate(employee.user._id, {
          avatar,
        });
      } catch (error) {
        console.log(error);
      }
    }

    req.flash("success_msg", "Datos actualizados correctamente.");
  } catch (error) {
    req.flash("error_msg", "Error al actualizar los datos.");
    console.log(error);
  }

  res.redirect(req.get("referer"));
};

ProfileController.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, password, newPassword, confirmPassword, email } = req.body;

  const user = await UserModel.findById(userId).lean();
  if (!(await comparePassword(password, user.password))) {
    req.flash("error_msg", "La contraseña actual no es correcta.");
  } else if (password == newPassword) {
    req.flash("error_msg", "La contraseña nueva no puede ser igual a la actual.");
  } else if (newPassword !== confirmPassword) {
    req.flash("error_msg", "Las contraseñas no coinciden.");
  } else {
    try {
      const updatedPassword = await encryptPassword(newPassword);
      await UserModel.findByIdAndUpdate(userId, {
        username,
        password: updatedPassword,
        email,
      });
      req.flash("success_msg", "Datos actualizados correctamente.");
    } catch (error) {
      req.flash("error_msg", "Error al actualizar los datos.");
      console.log(error);
    }
  }

  res.redirect(req.get("referer"));
};

module.exports = ProfileController;
