const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const DepartmentModel = require("../models/department.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const DepartmentController = {};
const fetch = require("node-fetch");

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
  /* const token = "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";

   const response = await fetch(
     "https://api.github.com/repos/Saluth-org/Saluth-Business/search/commits",
     {
       headers: {
         Authorization: `token ${token}`,
       },
     }
   );
   const data = await response.json();

  console.log(data); */

  const module = await ModuleModel.findOne({ name: "Departamentos" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Departamentos",
        description: "Módulo de administración de departamentos",
        url: "/api/department/list",
        icon: "fas fa-building",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_departments", description: "Permite leer los departamentos" },
        { name: "create_departments", description: "Permite crear departamentos" },
        { name: "update_departments", description: "Permite actualizar los departamentos" },
        { name: "delete_departments", description: "Permite eliminar los departamentos" },
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
      console.log("Module department configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module department added to application successfully");
        } else {
          console.log("Module department already added to application");
        }
      } catch (error) {
        console.log("Error configuring module department: ", error);
      }
    } catch (error) {
      console.log("Error adding module department to application: ", error);
    }
  }
})();

DepartmentController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Departamentos" }).lean();

  res.render("modules/RRHH/departments/form", { tabs, module });
};

DepartmentController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Departamentos" }).lean();

  const total = (await DepartmentModel.find({}).lean()).length;
  const active = (await DepartmentModel.find({ enable: true, archived: false })).length;
  const deleted = (await DepartmentModel.find({ enable: false, archived: true })).length;

  const list = await DepartmentModel.find({}).lean();
  res.render("modules/RRHH/departments/list", { module, tabs, list, total, active, deleted });
};

DepartmentController.getItem = async (req, res) => {
  const item = await DepartmentModel.findById(req.params.id).lean();
  res.render("modules/RRHH/departments/item", { item, tabs });
};

DepartmentController.createItem = async (req, res) => {
  const { name } = req.body;
  try {
    const newItem = new DepartmentModel({ name });
    await newItem.save();
    req.flash("success_msg", `Departamento Nº ${newItem._id} creado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el departamento ${name}`);
  }
  res.redirect("list");
};

DepartmentController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await DepartmentModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Departamento Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el departamento Nº ${req.params.id}`);
  }
  res.redirect("list");
};

DepartmentController.getItemsArchived = async (req, res) => {
  const list = await DepartmentModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

DepartmentController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await DepartmentModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Departamento Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el departamento Nº ${req.params.id}`);
  }
  res.redirect("list");
};

DepartmentController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await DepartmentModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Departamento Nº ${itemDeleted._id} eliminado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el departamento Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = DepartmentController;
