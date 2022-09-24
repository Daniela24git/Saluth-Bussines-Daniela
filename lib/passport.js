const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { comparePassword } = require("../helpers/handleBcrypt");
const EmployeeModel = require("../models/employee.model");
const UserModel = require("../models/user.model");
const PersonModel = require("../models/person.model");
const RoleModel = require("../models/role.model");
const ImageModel = require("../models/image.model");

passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const user = await UserModel.findOne({
        username,
        enable: true,
        archived: false,
      }).lean();
      if (!user) {
        return done(
          null,
          false,
          req.flash("signin_msg", "Usuario no encontrado.")
        );
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return done(
          null,
          false,
          req.flash("signin_msg", "Contraseña incorrecta.")
        );
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  const employee = await EmployeeModel.findOne({ user: _id })
    .select("position departament medical_branch")
    .populate({
      path: "person",
      select: "names surnames",
    })
    .populate({
      path: "user",
      select: "username email",
      populate: "avatar role settings",
    })
    .lean();
  done(null, employee);
});
