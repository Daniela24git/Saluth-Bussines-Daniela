const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const PermissionController = {};

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
  const module = await ModuleModel.findOne({ name: "Permisos" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Permisos",
        description: "Módulo de administración de permisos.",
        url: "/api/permission/list",
        icon: "fas fa-user-lock",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_permissions", description: "Permite leer los permisos" },
        { name: "create_permissions", description: "Permite crear permisos" },
        { name: "update_permissions", description: "Permite actualizar los permisos" },
        { name: "delete_permissions", description: "Permite eliminar los permisos" },     
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
      console.log("Module permission configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module permission added to application successfully");
        } else {
          console.log("Module permission already added to application");
        }
      } catch (error) {
        console.log("Error configuring module permission: ", error);
      }
    } catch (error) {
      console.log("Error adding module permission to application: ", error);
    }
  }
})();

PermissionController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Permisos" }).lean();

  res.render("modules/RRHH/permissions/form", { tabs, module });
};

PermissionController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Permisos" }).lean();

  const total = (await PermissionModel.find({}).lean()).length;
  const active = (await PermissionModel.find({ enable: true, archived: false })).length;
  const deleted = (await PermissionModel.find({ enable: false, archived: true })).length;

  const list = await PermissionModel.find({}).lean();
  res.render("modules/RRHH/permissions/list", { module, tabs, list, total, active, deleted });
};

PermissionController.getItem = async (req, res) => {
  const item = await PermissionModel.findById(req.params.id).lean();
  res.render("modules/RRHH/permissions/item", { item, tabs });
};

PermissionController.createItem = async (req, res) => {
  const { name } = req.body;
  try {
    const newItem = new PermissionModel({ name });
    await newItem.save();
    req.flash("success_msg", `Permiso Nº ${newItem._id} creado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el permiso ${name}`);
    console.log(error);
  }
  res.redirect("list");
};

PermissionController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await PermissionModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Permiso Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el permiso Nº ${req.params.id}`);
  }
  res.redirect("list");
};

PermissionController.getItemsArchived = async (req, res) => {
  const list = await PermissionModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

PermissionController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await PermissionModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Permiso Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el permiso Nº ${req.params.id}`);
  }
  res.redirect("list");
};

PermissionController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await PermissionModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Permiso Nº ${itemDeleted._id} eliminado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el permiso Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = PermissionController;
