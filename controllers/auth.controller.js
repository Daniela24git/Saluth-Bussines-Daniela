<<<<<<< HEAD
const UserModel = require("../models/user.model");
const MedicalBranchModel = require("../models/medical_branch.model");
const handleBcrypt = require("../helpers/handleBcrypt");
const { generateJwt } = require("../helpers/handleJwt");
const jwt = require("jsonwebtoken");
=======
>>>>>>> 36ad3bfdeb92e151c572284d93dcb162ee492548
const passport = require("passport");
const jwt = require("jsonwebtoken"); 

const { SECRET } = require("../../config/env.config");
const { encryptPassword } = require("../helpers/handleBcrypt");
const { generateEmail } = require("../helpers/handleEmail");

//Models
const EmployeModel = require("../models/employee.model");
const UserModel = require("../models/user.model");

const AuthController = {};

AuthController.viewSignin = (req, res) => {
  res.render("users/signin");
};

AuthController.signin = passport.authenticate("signin", {
  successRedirect: "/api/dashboard",
  failureRedirect: "/api/auth/signin",
  failureFlash: true,
});

AuthController.signout = (req, res) => {
  req.logOut();
  res.redirect("/api/auth/signin");
};

AuthController.viewVerifyEmail = (req, res) => {
  res.render("users/reset/verify_email");
};

AuthController.sendResetEmail = async (req, res) => {
  const token = req.params.token;
  let email = req.body.email;

  if (token) {
    const payload = jwt.verify(token, SECRET);
    console.log(payload);
    const user = await UserModel.findById(payload.id).lean();
    email = user.email;

    if (payload.timeLeft > Date.now()) {
      req.flash("reset_msg", "Ya se ha enviado un correo de verificación.");
      return res.redirect("/api/auth/password_reset/email_sent/" + token);
    }
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    req.flash("reset_msg", "No existe un usuario con ese correo.");
    return res.redirect("/api/auth/password_reset");
  }

  const newPayload = { id: user._id, timeLeft: Date.now() + 300000 };

  const newtoken = jwt.sign(newPayload, SECRET, { expiresIn: "5m" });

  const dataEmail = {
    email: user.email,
    subject: "Restablecer contraseña",
    link: `http://localhost:4000/api/auth/password_reset/${newtoken}`,
    template: "reset_password",
  };

  generateEmail(dataEmail);

  return res.redirect("/api/auth/password_reset/email_sent/" + newtoken);
};

AuthController.viewEmailSent = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    req.flash("signin_msg", "El link de restablecimiento de contraseña es invalido.");
    return res.redirect("/api/auth/signin");
  }

  const payload = jwt.verify(req.params.token, SECRET);
  const time = payload.timeLeft - Date.now();

  res.render("users/reset/email_sent", { time, token });
};

AuthController.viewResetPassword = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    req.flash("signin_msg", "El link de restablecimiento de contraseña es invalido.");
    return res.redirect("/api/auth/signin");
  }

  const payload = jwt.verify(req.params.token, SECRET);
  const employee = await EmployeModel.findOne({ user: payload.id }).populate("person").lean();
  const names = employee.person.names;

  res.render("users/reset/reset_password", { token, names });
};

AuthController.resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;
  if (!token) {
    req.flash("signin_msg", "El link de restablecimiento de contraseña es invalido.");
    return res.redirect("/api/auth/signin");
  }

  if (password !== confirmPassword) {
    req.flash("reset_msg", "Las contraseñas no coinciden.");
    return res.redirect("/api/auth/password_reset/" + token);
  }
  const payload = jwt.verify(token, SECRET);
  await UserModel.findByIdAndUpdate(payload.id, {
    password: await encryptPassword(password),
  });

  req.flash("signin_msg", "Contraseña restablecida exitosamente.");
  return res.redirect("/api/auth/signin");
};

module.exports = AuthController;
