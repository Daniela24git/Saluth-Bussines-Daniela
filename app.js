const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const exphbs = require("express-handlebars");
const passport = require("passport");
const morgan = require("morgan");
const multer = require("multer");
const flash = require("connect-flash");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const navegationController = require("./controllers/navegation.controller");
const { name, version } = require("../package.json");
const { MONGODB_URI } = require("../config/env.config");

// initializations
const app = express();
app.disable("x-powered-by");
require("./console");
require("./app.config");
require("./lib/passport");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb, filename) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

app.use(multer({ storage: storage }).single("image"));

// settings
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpres: require("./lib/handlebars"),
  })
);

app.set("view engine", ".hbs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions_management",
});
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.app = { name: name, version: version };
  app.locals.signin_msg = req.flash("signin_msg");
  app.locals.reset_msg = req.flash("reset_msg");
  app.locals.success_msg = req.flash("success_msg");
  app.locals.error_msg = req.flash("error_msg");
  app.locals.error_401_msg = req.flash("error_401_msg");
  app.locals.employee = req.user;
  next();
});

app.use(navegationController.nav);

app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api", require("./routes/index"));

module.exports = app;
