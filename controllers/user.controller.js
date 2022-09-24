const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const PermissionModel = require("../models/permission.model");
const MedicalInstitutionModel = require("../models/medical_institution.model");
const MedicalBranchModel = require("../models/medical_branch.model");
const EmployeeModel = require("../models/employee.model");
const PersonModel = require("../models/person.model");
const UserModel = require("../models/user.model");
const Jwt = require("jsonwebtoken");
const { encryptPassword } = require("../helpers/handleBcrypt");
const { SECRET } = require("../../config/env.config");
const { generateEmail } = require("../helpers/handleEmail");
const { name } = require("../../package.json");

const UserController = {};

const tabs = [
  { title: "Departamentos" },
  { title: "Áreas" },
  { title: "Cargos" },
  { title: "Horarios" },
  { title: "Roles" },
  { title: "Permisos" },
  { title: "Empleados" },
  { title: "Usuarios" },
];

(async () => {
  const module = await ModuleModel.findOne({ name: "Usuarios" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Usuarios",
        description: "Módulo de administración de horarios.",
        url: "/api/user/list",
        icon: "fas fa-user",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_users", description: "Permite leer los usuarios" },
        { name: "create_users", description: "Permite crear usuarios" },
        { name: "update_users", description: "Permite actualizar los usuarios" },
        { name: "delete_users", description: "Permite eliminar los usuarios" },
      ];

      news_permission.forEach(async (permission) => {
        if (!(await PermissionModel.findOne({ name: permission.name }).lean())) {
          const newPermission = new PermissionModel({
            name: permission.name,
            description: permission.description,
          });
          await newPermission.save();
          await newModule.updateOne({ $push: { permissions: newPermission._id } });
        } else {
          const permission_found = await PermissionModel.findOne({ name: permission.name }).lean();
          await newModule.updateOne({ $push: { permissions: permission_found._id } });
        }
      });

      await newModule.save();
      console.log("Module user configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module user added to application successfully");
        } else {
          console.log("Module user already added to application");
        }
      } catch (error) {
        console.log("Error configuring module user: ", error);
      }
    } catch (error) {
      console.log("Error adding module user to application: ", error);
    }
  }
})();

UserController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Usuarios" }).lean();

  const total = (await UserModel.find({}).lean()).length;
  const active = (await UserModel.find({ enable: true, archived: false })).length;
  const deleted = (await UserModel.find({ enable: false, archived: true })).length;

  const list = await UserModel.find({}).populate("avatar").populate("role").lean();
  res.render("modules/RRHH/users/list", { module, tabs, list, total, active, deleted });
};

UserController.getItem = async (req, res) => {
  const item = await UserModel.findById(req.params.id).lean();
  res.render("modules/RRHH/users/item", { item, tabs });
};

UserController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await UserModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Usuario Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el usuario Nº ${req.params.id}`);
  }
  res.redirect("list");
};


UserController.createUser = async (req, res) => {
  const tokenEmployee = req.params.tokenE;
  const payload = Jwt.verify(tokenEmployee, SECRET);
  console.log(payload);
  const email = payload.user.email;
  try {
    const person = await PersonModel.create({
      identification: payload.person.identification,
      names: payload.person.names,
      surnames: payload.person.surnames,
    });

    const institution = await MedicalInstitutionModel.findById(payload.medical_institution).lean();
    console.log(institution);
    const branch = await MedicalBranchModel.findById(payload.medical_branch).lean();
    console.log(branch);
    const username =
      branch.name.substring(0, 1) +
      institution.name.substring(0, 1) +
      payload.person.surnames.substring(0, 3) +
      payload.person.surnames.substring(3, 4);

    const password = Math.random().toString(36).substring(2, 12);
    const user = await UserModel.create({
      username,
      password: await encryptPassword(password),
      email: payload.user.email,
    });
    const employee = await EmployeeModel.create({
      medical_branch: payload.medical_branch,
      person: person.id,
      user: user._id,
    });
    const data = {
      email: payload.user.email,
      subject: "Bienvenid@ a Saluth",
      template: "welcome_employee",
      username,
      password,
      name: payload.person.names,
      department: payload.department,
      institution: institution.name,
      branch: branch.name,
      link: "http://localhost:3000/api/auth/signin",
      app: "Saluth" + name,
    };

    generateEmail(data);

    const message = "Usuario creado con éxito";
    res.render("modules/RRHH/users/success", { message, email });
  } catch (error) {
    const message = "Error al crear el usuario";
    console.log(error);
    res.render("modules/RRHH/users/success", { message, email });
  }
};

module.exports = UserController;
