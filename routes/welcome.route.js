const express = require("express");
const router = express.Router();

const {
  getInstitution,
  updateInstitution,
  getBranch,
  getBranches,
  getBranchForm,
  createBranch
  /* createItem,  
  getSuccess,
  getForm, */
} = require("../controllers/welcome.controller");

const { auth } = require("../lib/auth");

router.get("/medical_institution/:tokenI",auth, getInstitution);
router.post("/medical_institution/:tokenI/update",auth, updateInstitution);

router.get("/medical_institution/:tokenI/medical_branch/:tokenB",auth, getBranch);

router.get("/medical_institution/:tokenI/medical_branches/list",auth, getBranches);

router.get("/medical_institution/:tokenI/medical_branch/form/new",auth, getBranchForm);
router.post("/medical_institution/:tokenI/medical_branch/form/save",auth, createBranch);

/* router.get("/medical_institution/:id/branch",auth, getForm);
router.post("/medical_institution/branch/save",auth, createItem);
router.get("/medical_institution/branch/success",auth, getSuccess); */




module.exports = router;
