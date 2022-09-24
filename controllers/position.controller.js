const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const PositionModel = require("../models/position.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const PositionController = {};

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
  const module = await ModuleModel.findOne({ name: "Cargos" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Cargos",
        description: "Módulo de administración de cargos.",
        url: "/api/position/list",
        icon: "fas fa-user-tag",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_positions", description: "Permite leer los cargos" },
        { name: "create_positions", description: "Permite crear cargos" },
        { name: "update_positions", description: "Permite actualizar los cargos" },
        { name: "delete_positions", description: "Permite eliminar los cargos" },
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
      console.log("Module position configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module position added to application successfully");
        } else {
          console.log("Module position already added to application");
        }
      } catch (error) {
        console.log("Error configuring module position: ", error);
      }
    } catch (error) {
      console.log("Error adding module position to application: ", error);
    }
  }
})();

PositionController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Cargos" }).lean();

  res.render("modules/RRHH/positions/form", { tabs, module });
};

PositionController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Cargos" }).lean();

  const total = (await PositionModel.find({}).lean()).length;
  const active = (await PositionModel.find({ enable: true, archived: false })).length;
  const deleted = (await PositionModel.find({ enable: false, archived: true })).length;

  const list = await PositionModel.find({}).lean();
  res.render("modules/RRHH/positions/list", { module, tabs, list, total, active, deleted });
};

PositionController.getItem = async (req, res) => {
  const item = await PositionModel.findById(req.params.id).lean();
  res.render("modules/RRHH/positions/item", { item, tabs });
};

PositionController.createItem = async (req, res) => {
  const { name, salary } = req.body;
  try {
    const newItem = new PositionModel({ name, salary });
    await newItem.save();
    req.flash("success_msg", `Cargo Nº ${newItem._id} creado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el cargo ${name}`);
  }
  res.redirect("list");
};

PositionController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await PositionModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Cargo Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el cargo Nº ${req.params.id}`);
  }
  res.redirect("list");
};

PositionController.getItemsArchived = async (req, res) => {
  const list = await PositionModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

PositionController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await PositionModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Cargo Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el cargo Nº ${req.params.id}`);
  }
  res.redirect("list");
};

PositionController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await PositionModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Cargo Nº ${itemDeleted._id} eliminado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el cargo Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = PositionController;
