const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const AreaModel = require("../models/area.model");
const DepartmentModel = require("../models/department.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const AreaController = {};

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
  const module = await ModuleModel.findOne({ name: "Áreas" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Áreas",
        description: "Módulo de administración de áreas",
        url: "/api/area/list",
        icon: "fas fa-building",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_areas", description: "Permite leer áreas" },
        { name: "create_areas", description: "Permite crear áreas" },
        { name: "update_areas", description: "Permite actualizar áreas" },
        { name: "delete_areas", description: "Permite eliminar áreas" },
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
      console.log("Module area configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module area added to application successfully");
        } else {
          console.log("Module area already added to application");
        }
      } catch (error) {
        console.log("Error configuring module area: ", error);
      }
    } catch (error) {
      console.log("Error adding module area to application: ", error);
    }
  }
})();

AreaController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Áreas" }).lean();

  const depataments_list = await DepartmentModel.find({ enable: true, archived: false }).lean();
  res.render("modules/RRHH/areas/form", { tabs, depataments_list, module });
};

AreaController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Áreas" }).lean();

  const total = (await AreaModel.find({}).lean()).length;
  const active = (await AreaModel.find({ enable: true, archived: false })).length;
  const deleted = (await AreaModel.find({ enable: false, archived: true })).length;

  const list = await AreaModel.find({}).lean();
  res.render("modules/RRHH/areas/list", { module, tabs, list, total, active, deleted });
};

AreaController.getItem = async (req, res) => {
  const item = await AreaModel.findById(req.params.id).lean();
  res.render("modules/RRHH/areas/item", { item, tabs });
};

AreaController.createItem = async (req, res) => {
  const { name, departments } = req.body;
  try {
    const newItem = new AreaModel({
      name,
      departments,
    });
    await newItem.save();
    req.flash("success_msg", `Área Nº ${newItem._id} creada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el área ${name}`);
  }
  res.redirect("list");
};

AreaController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await AreaModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Área Nº ${itemUpdated._id} actualizada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el área Nº ${req.params.id}`);
  }
  res.redirect("list");
};

AreaController.getItemsArchived = async (req, res) => {
  const list = await AreaModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

AreaController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await AreaModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Área Nº ${itemArchived._id} archivada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el área Nº ${req.params.id}`);
  }
  res.redirect("list");
};

AreaController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await AreaModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Área Nº ${itemDeleted._id} eliminada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el área Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = AreaController;
