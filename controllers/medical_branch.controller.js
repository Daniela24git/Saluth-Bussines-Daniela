const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const PermissionModel = require("../models/permission.model");
const MedicalBranchModel = require("../models/medical_branch.model");
const BranchCategoryModel = require("../models/branch_category.model");
const { name } = require("../../package.json");

const branch = {};

const tabs = [
  { title: "Sucursales", var: "branch" },
];

(async () => {
  const module = await ModuleModel.findOne({ name: "Sucursales" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Sucursales",
        description: "Módulo de administración de sucursales",
        url: "/api/medical_branch/list",
        icon: "fas fa-hospital",
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "Nuevos" }).lean(),
      });

      const news_permission = [
        { name: "read_medical_branches", description: "Permite leer sucursales" },
        { name: "create_medical_branches", description: "Permite crear sucursales" },
        { name: "update_medical_branches", description: "Permite actualizar sucursales" },
        { name: "delete_medical_branches", description: "Permite eliminar sucursales" },
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
      console.log("Module medical branch configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module medical branch added to application successfully");
        } else {
          console.log("Module medical branch already added to application");
        }
      } catch (error) {
        console.log("Error configuring module medical branch: ", error);
      }
    } catch (error) {
      console.log("Error adding module medical branch to application: ", error);
    }
  }
})();

branch.getform = async (req, res) => {
  const branch_categories_list = await BranchCategoryModel.find({ }).lean();
  res.render("modules/medical_branches/form", { tabs, branch_categories_list });
};

branch.getItems = async (req, res) => {
  const total = (await MedicalBranchModel.find({}).lean()).length;
  const active = (await MedicalBranchModel.find({ enable: true, archived: false })).length;
  const deleted = (await MedicalBranchModel.find({ enable: false, archived: true })).length;
  const list = await MedicalBranchModel.find({}).populate("category").lean();
  res.render("modules/medical_branches/list", { tabs, list, total, active, deleted });
};

branch.getItem = async (req, res) => {
  const item = await MedicalBranchModel.findById(req.params.id).lean();
  const branch_categories_list = await BranchCategoryModel.find({ }).lean();
  res.render("modules/medical_branches/item", { item, tabs, branch_categories_list});
};

branch.createItem = async (req, res) => {
  const { name, direction, category } = req.body;
  try {
    const newItem = new MedicalBranchModel({
      name,
      direction, 
      category,
    });
    await newItem.save();
    req.flash("success_msg", `Sucursal Nº ${newItem._id} creada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al crear la Sucursal ${name}`);
  }
  res.redirect("list");
};

branch.updateItem = async (req, res) => {
  const { name, direction, category } = req.body;
  try {
    const itemUpdated = await MedicalBranchModel.findByIdAndUpdate(req.params.id, { name, direction, category });
    req.flash("success_msg", `Sucursal Nº ${itemUpdated._id} actualizada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al actualizar la Sucursal Nº ${req.params.id}`);
  }
  res.redirect("/api/medical_branch/list");
};

branch.getItemsArchived = async (req, res) => {
  const list = await MedicalBranchModel.find({ archived: true }).lean();
  res.render("list", { tabs, list });
};

branch.archiveItem = async (req, res) => {
  try {
    const itemArchived = await MedicalBranchModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Sucursal Nº ${itemArchived._id} archivada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar la sucursal Nº ${req.params.id}`);
  }
  res.redirect("list");
};

branch.deleteItem = async (req, res) => {
  try {
    const itemDeleted = await MedicalBranchModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", `Sucursal Nº ${itemDeleted._id} eliminada correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al eliminar la Sucursal Nº ${req.params.id}`);
  }
  res.redirect("list");
};

module.exports = branch;
