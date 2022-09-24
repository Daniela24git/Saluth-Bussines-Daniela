const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const EmployeeModel = require("../models/employee.model");
const PersonModel = require("../models/person.model");
const UserModel = require("../models/user.model");
const PermissionModel = require("../models/permission.model");
const { name } = require("../../package.json");

const EmployeeController = {};

const tabs = [
  { title: "Departamentos" },
  { title: "Áreas" },
  { title: "Cargos" },
  { title: "Horarios" },
  { title: "Roles" },
  { title: "Permisos" },
  { title: "Doers" },
  { title: "Usuarios" },
];

(async () => {
  const module = await ModuleModel.findOne({ name: "Empleados" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Empleados",
        description: "Módulo de administración de empleados.",
        url: "/api/employee/list",
        icon: "fas fa-users",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_employees", description: "Permite leer los empleados" },
        { name: "create_employees", description: "Permite crear empleados" },
        { name: "update_employees", description: "Permite actualizar los empleados" },
        { name: "delete_employees", description: "Permite eliminar los empleados" },
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
      console.log("Module employee configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module employee added to application successfully");
        } else {
          console.log("Module employee already added to application");
        }
      } catch (error) {
        console.log("Error configuring module employee: ", error);
      }
    } catch (error) {
      console.log("Error adding module employee to application: ", error);
    }
  }
})();

EmployeeController.getform = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Empleados" }).lean();

  res.render("modules/RRHH/employees/form", { tabs, module });
};

EmployeeController.getItems = async (req, res) => {
  const module = await ModuleModel.findOne({ name: "Doers" }).lean();

  const total = (await EmployeeModel.find({}).lean()).length;
  const active = (await EmployeeModel.find({ enable: true, archived: false })).length;
  const deleted = (await EmployeeModel.find({ enable: false, archived: true })).length;

  const list = await EmployeeModel.find({}).populate("person").lean();
  res.render("modules/RRHH/employees/list", { module, tabs, list, total, active, deleted });
};

EmployeeController.getItem = async (req, res) => {
  const item = await EmployeeModel.findById(req.params.id).lean();
  res.render("modules/RRHH/employees/item", { item, tabs });
};

EmployeeController.createItem = async (req, res) => {
  const {} = req.body;
  try {
    const newItem = new EmployeeModel({});
    await newItem.save();
    req.flash("success_msg", `Empleado Nº ${newItem._id} creado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear el empleado ${f}`);
    console.log(error);
  }
  res.redirect("list");
};

EmployeeController.updateItem = async (req, res) => {
  const { name } = req.body;
  try {
    const itemUpdated = await EmployeeModel.findByIdAndUpdate(req.params.id, { name });
    req.flash("success_msg", `Empleado Nº ${itemUpdated._id} actualizado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar el empleado Nº ${req.params.id}`);
  }
  res.redirect("list");
};

EmployeeController.getItemsArchived = async (req, res) => {
  const list = await EmployeeModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

EmployeeController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await EmployeeModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Empleado Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el empleado Nº ${req.params.id}`);
  }
  res.redirect("list");
};

EmployeeController.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await EmployeeModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Empleado Nº ${itemDeleted._id} eliminado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar el empleado Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = EmployeeController;
