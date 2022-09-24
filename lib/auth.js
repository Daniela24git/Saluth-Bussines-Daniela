const EmployeeModel = require("../models/employee.model");
const MedicalInstitutionModel = require("../models/medical_institution.model");
const MedicalBranchModel = require("../models/medical_branch.model");
const Jwt = require("jsonwebtoken");
const { SECRET } = require("../../config/env.config");
module.exports = {
  auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect("/api/auth/signin");
  },

  not_auth(req, res, next) {
    if (!req.isAuthenticated()) return next();
    return res.redirect("/api/dashboard/home");
  },

  async first_auth(req, res, next) {
    const medical_branch = await MedicalBranchModel.findById(req.user.medical_branch);

    const medical_institutions = await MedicalInstitutionModel.find()
      .populate("medical_branches")
      .lean();

    const medical_institution = medical_institutions.find((institution) => {
      return institution.medical_branches.find((branch) => {
        return branch._id.toString() == medical_branch._id.toString();
      });
    });
    if (medical_institution.medical_branches.length == 1) {
      const tokenInstitution = Jwt.sign({ id: medical_institution._id }, SECRET);

      return res.redirect("/api/welcome/medical_institution/" + tokenInstitution);
    } else {
      return res.redirect("/api/dashboard/home");
    }
  },
};
