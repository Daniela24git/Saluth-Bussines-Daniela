const MedicalInstitutionModel = require("../models/medical_institution.model");
const MedicalBranchModel = require("../models/medical_branch.model");
const BranchCategoryModel = require("../models/branch_category.model");
const InstitutionTypeModel = require("../models/institution_type.model");
const ImageModel = require("../models/image.model"); 
const DepartmentModel = require("../models/department.model");
const PositionModel = require("../models/position.model");
const RoleModel = require("../models/role.model");
const Jwt = require("jsonwebtoken");
const { SECRET } = require("../../config/env.config");
const { generateEmail } = require("../helpers/handleEmail");
const welcome = {};

welcome.getInstitution = async (req, res) => {
  console.log(req.params.tokenI);
  const tokenInstitution = Jwt.verify(req.params.tokenI, SECRET);
  console.log(tokenInstitution);
  const medical_institution = await MedicalInstitutionModel.findById(
    tokenInstitution.id
  ).populate("logo").lean();
  const types = await InstitutionTypeModel.find().lean();
  res.render("modules/welcome/medical_institution", {  
    medical_institution,
    types,
  });
};

welcome.updateInstitution = async (req, res) => {
  const { name, type } = req.body;
  const tokenInstitution = Jwt.sign({ id: req.params.tokenI}, SECRET);
  const medical_institution = await MedicalInstitutionModel.findById(req.params.tokenI).lean();

  try {   
    var logo = null; 
    if (req.file) {
      const { filename, originalname, mimetype, size } = req.file;
      logo = await ImageModel.create({  
        filename,
        path: "/img/uploads/" + filename,
        originalname,
        mimetype,
        size,
      });
    }

    await MedicalInstitutionModel.findByIdAndUpdate(req.params.tokenI, {
      name,
      type,
      logo,
    });
  } catch (error) {
    req.flash( 
      "error_msg",
      `Error al actualizar la institución médica ${req.params.tokenI} `
    );
    console.log(error);
  }
 
  const parent_branch = medical_institution.medical_branches[0];
  const tokenMedicalBranch = Jwt.sign({ id: parent_branch }, SECRET);
  res.redirect(
    "/api/welcome/medical_institution/" + 
      tokenInstitution + 
      "/medical_branch/" +
      tokenMedicalBranch
  );
};

welcome.getBranch = async (req, res) => {
  const tokenInstitution = req.params.tokenI;
  const tokenMedicalBranch = Jwt.verify(req.params.tokenB, SECRET);
  const medical_branch = await MedicalBranchModel.findById(
    tokenMedicalBranch.id
  )
    .populate("category")
    .lean();
  res.render("modules/welcome/medical_branch", {
    tokenInstitution,
    medical_branch,
  });
};

welcome.getBranches = async (req, res) => {
  const medical_branches = await MedicalBranchModel.find().lean();
  res.render("modules/welcome/medical_branches", { medical_branches });
};

welcome.getBranchForm = async (req, res) => {
  const tokenInstitution = req.params.tokenI;
  const branch_categories = await BranchCategoryModel.find().lean();
  const department = await DepartmentModel.findOne({name: "Administración"}).lean();
  const position = await PositionModel.findOne({name: "Administrador"}).lean();
  const role = await RoleModel.findOne({name: "Administrador"}).lean();
  res.render("modules/welcome/medical_branch_form", {
    tokenInstitution,
    branch_categories,
    department,
    position,
    role,
  });
};

welcome.createBranch = async (req, res) => {
  const tokenI=req.params.tokenI;
  const tokenInstitution = Jwt.verify(tokenI, SECRET);
  const { name, province, canton, parish, direction, category, identification, names, surnames, email, department, position , role } = req.body;
  try {
    const medical_branch = await MedicalBranchModel.create({
      name,
      province,
      canton,
      parish,
      direction,
      category,
    });
    await MedicalInstitutionModel.findByIdAndUpdate(tokenInstitution.id, {
      $push: { medical_branches: medical_branch._id },
    });
    const tokenMedicalBranch = Jwt.sign({ id: medical_branch._id }, SECRET);
    
    const dataEmployee = {
      medical_institution: tokenInstitution.id,
      medical_branch: medical_branch._id,
      department:await DepartmentModel.findById(department).lean(),
      position:await PositionModel.findById(position).lean(),
      person: {
        identification,
        names,
        surnames,
      },
      user: {
        email,
        role:await RoleModel.findById(role).lean(),

      }
      
    };
    const tokenE = Jwt.sign(dataEmployee, SECRET, { expiresIn: "1h" });
    const data = {
      email,
      subject: "Verificar correo electronico",
      link: `http://localhost:3000/api/user/generate/${tokenE}`,
      template: "verify_email",
    };
    
    generateEmail(data);
    

    req.flash("success_msg", "Sucursal creada con éxito");
    res.redirect(
      "/api/welcome/medical_institution/" +
        tokenI +
        "/medical_branch/" +
        tokenMedicalBranch
    );
  } catch (error) {
    req.flash("error_msg", `Error al crear la sucursal ${name}`);
    console.log(error);
    res.redirect(
      "/api/welcome/medical_institution/" +
        tokenInstitution +
        "/medical_branch/form/new"
    );
  }
};

/* welcome.getSuccess = async (req, res) => {};

welcome.createItem = async (req, res) => {};

welcome.getForm = async (req, res) => {
  const tokenInstitution = Jwt.verify(req.params.id, SECRET);
  const item = await MedicalInstitutionModel.findById(tokenInstitution.id);
  //buscar la primera sucursal de la institución
  const branches = await MedicalBranchModel.find().lean();
  const branch = branches[0];
    
  res.render("modules/welcome/medical_branch", { branch });
}; */

module.exports = welcome;
