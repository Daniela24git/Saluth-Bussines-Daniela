const ApplicationModel = require("../models/application.model");
const ModuleModel = require("../models/module.model");
const ModuleTypeModel = require("../models/module_type.model");
const ModuleCategoryModel = require("../models/module_category.model");
const PatientModel = require("../models/patient.model");

const { name } = require("../../package.json");

const patientController = {};

const tabs = [
  { title: "Pacientes", var: "patient" },
];

(async () => {
  const module = await ModuleModel.findOne({ name: "Pacientes" }).lean();
  if (!module) {
    try {
      const newModule = new ModuleModel({
        name: "Pacientes",
        description: "Módulo de administración de pacientes",
        url: "/api/patient/list",
        icon: "fas fa-user-injured", 
        type: await ModuleTypeModel.findOne({ name: "Público" }).lean(),
        category: await ModuleCategoryModel.findOne({ name: "New Modules" }).lean(),
      });
      await newModule.save();
      console.log("Module patient configured successfully");

      try {
        const application = await ApplicationModel.findOne({ name: name }).lean();
        if (!application.modules.includes(newModule._id)) {
          await ApplicationModel.findByIdAndUpdate(application._id, {
            $push: { modules: newModule._id },
          });
          console.log("Module patient added to application successfully");
        } else {
          console.log("Module patient already added to application");
        }
      } catch (error) {
        console.log("Error configuring module patient: ", error);
      }
    } catch (error) {
      console.log("Error adding module patient to application: ", error);
    }
  }
})();

patientController.getItems = async (req, res) => {
  const total = (await PatientModel.find({}).lean()).length;
  const active = (await PatientModel.find({ enable: true, archived: false })).length;
  const deleted = (await PatientModel.find({ enable: false, archived: true })).length;
  const list = await PatientModel.find({}).populate("person").populate("user").lean();

  if (req.params.id) {
    const item = await PatientModel.findById(req.params.id).populate("person").populate("user").lean();
    return res.render("modules/patients/list", { tabs, list, item, total, active, deleted });
  }

  res.render("modules/patients/list", { tabs, list, total, active, deleted });
};

patientController.getItemsArchived = async (req, res) => {
  const list = await PatientModel.find({ archived: true }).lean();
  res.render("modules/patients/list", { tabs, list });
};

patientController.archiveItem = async (req, res) => {
  try {
    const itemArchived = await PatientModel.findByIdAndUpdate(req.params.id, { archived: true });
    req.flash("success_msg", `Paciente Nº ${itemArchived._id} archivado correctamente.`);
  } catch (error) {
    req.flash("error_msg", `Error al archivar el paciente Nº ${req.params.id}`);
  }
  res.redirect("modules/patients/list");
};

module.exports = patientController;
