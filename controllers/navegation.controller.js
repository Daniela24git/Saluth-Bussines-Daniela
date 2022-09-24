const ApplicationModel = require("../models/application.model"); 
const ModuleCategoryModel = require("../models/module_category.model"); 

const MedicalInstitutionModel = require("../models/medical_institution.model");
const MedicalBranchModel = require("../models/medical_branch.model");

const { name } = require("../../package.json");
const NavegationController = {};

NavegationController.nav = async (req, res, next) => {
  const application = await ApplicationModel.findOne({ name: name, enable: true, archived: false })
    .collation({ locale: "es" })
    .populate({
      path: "modules",
      options: { sort: { name: 1 } },
      populate: { path: "category", model: "Module_Category" },
    })
    .lean();
  const module_categories = await ModuleCategoryModel.find().lean();
  const categories = module_categories.filter((module_category) =>
    application.modules.some(
      (module) => module.category._id.toString() === module_category._id.toString()
    )
  );
  if (req.user) {
    const medical_branch = await MedicalBranchModel.findById(req.user.medical_branch).lean();
    const medical_institutions = await MedicalInstitutionModel.find()
      .populate("medical_branches")
      .populate("logo")  
      .lean();

    const medical_institution = medical_institutions.find((institution) => {
      return institution.medical_branches.find((branch) => {
        return branch._id.toString() === medical_branch._id.toString();
      });
    });
    res.locals.medical_institution_user = medical_institution;
    res.locals.medical_branch_user = medical_branch;
  }

  res.locals.app_modules = application.modules;  
  res.locals.modules_category = categories;

  next();
};

module.exports = NavegationController;
