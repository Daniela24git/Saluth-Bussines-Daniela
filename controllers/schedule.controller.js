const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const ScheduleModel = require("../models/schedule.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const ScheduleController = {};

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
  const module = await ModuleModel.findOne({ name: "Horarios" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Horarios",
        description: "Módulo de administración de horarios.",
        url: "/api/schedule/list",
        icon: "fas fa-clock",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_schedules", description: "Permite leer los horarios" },
        { name: "create_schedules", description: "Permite crear horarios" },
        { name: "update_schedules", description: "Permite actualizar los horarios" },
        { name: "delete_schedules", description: "Permite eliminar los horarios" },
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
      console.log("Module schedule configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module schedule added to application successfully");
        } else {
          console.log("Module schedule already added to application");
        }
      } catch (error) {
        console.log("Error configuring module schedule: ", error);
      }
    } catch (error) {
      console.log("Error adding module schedule to application: ", error);
    }
  }
})();

ScheduleController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Horarios" }).lean();

  res.render("modules/RRHH/schedules/form", { tabs, module });
};

ScheduleController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Horarios" }).lean();

  const total = (await ScheduleModel.find({}).lean()).length;
  const active = (await ScheduleModel.find({ enable: true, archived: false })).length;
  const deleted = (await ScheduleModel.find({ enable: false, archived: true })).length;

  const list = await ScheduleModel.find({}).lean();
  res.render("modules/RRHH/schedules/list", { module, tabs, list, total, active, deleted });
};

ScheduleController.getItem = async (req, res) => {
  const item = await ScheduleModel.findById(req.params.id).lean();
  res.render("modules/RRHH/schedules/item", { item, tabs });
};

ScheduleController.createItem = async (req, res) => {
  const { time_start, time_end, time_lunch, time_lunch_duration } = req.body;
  try {
    const newItem = new ScheduleModel({ time_start, time_end, time_lunch, time_lunch_duration });
    await newItem.save();
    req.flash("success_msg", `Horario Nº ${newItem._id} creado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el horario ${time_start} - ${time_end}`);
    console.log(error);
  }
  res.redirect("list");
};

ScheduleController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await ScheduleModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Horario Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el horario Nº ${req.params.id}`);
  }
  res.redirect("list");
};

ScheduleController.getItemsArchived = async (req, res) => {
  const list = await ScheduleModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

ScheduleController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await ScheduleModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Horario Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el horario Nº ${req.params.id}`);
  }
  res.redirect("list");
};

ScheduleController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await ScheduleModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Horario Nº ${itemDeleted._id} eliminado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el horario Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = ScheduleController;
