const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const RoleModel = require("../models/role.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const RoleController = {};

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
  const module = await ModuleModel.findOne({ name: "Roles" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Roles",
        description: "Módulo de administración de roles.",
        url: "/api/role/list",
        icon: "fas fa-user-tag",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_roles", description: "Permite leer los roles" },
        { name: "create_roles", description: "Permite crear roles" },
        { name: "update_roles", description: "Permite actualizar los roles" },
        { name: "delete_roles", description: "Permite eliminar los roles" },
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
      console.log("Module role configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module role added to application successfully");
        } else {
          console.log("Module role already added to application");
        }
      } catch (error) {
        console.log("Error configuring module role: ", error);
      }
    } catch (error) {
      console.log("Error adding module role to application: ", error);
    }
  }
})();

RoleController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Roles" }).lean();
  const permissions = await PermissionModel.find({}).lean();

  res.render("modules/RRHH/roles/form", { tabs, module, permissions });
};

RoleController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Roles" }).lean();

  const total = (await RoleModel.find({}).lean()).length;
  const active = (await RoleModel.find({ enable: true, archived: false })).length;
  const deleted = (await RoleModel.find({ enable: false, archived: true })).length;

  const list = await RoleModel.find({}).lean();
  res.render("modules/RRHH/roles/list", { module, tabs, list, total, active, deleted });
};

RoleController.getItem = async (req, res) => {
  const item = await RoleModel.findById(req.params.id).lean();
  res.render("modules/RRHH/roles/item", { item, tabs });
};

RoleController.createItem = async (req, res) => {
  const { name } = req.body;
  try {
    const newItem = new RoleModel({ name });
    await newItem.save();
    req.flash("success_msg", `Rol Nº ${newItem._id} creado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el rol ${name}`);
    console.log(error);
  }
  res.redirect("list");
};

RoleController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await RoleModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Rol Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el rol Nº ${req.params.id}`);
  }
  res.redirect("list");
};

RoleController.getItemsArchived = async (req, res) => {
  const list = await RoleModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

RoleController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await RoleModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Rol Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el rol Nº ${req.params.id}`);
  }
  res.redirect("list");
};

RoleController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await RoleModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Rol Nº ${itemDeleted._id} eliminado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el rol Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = RoleController;
