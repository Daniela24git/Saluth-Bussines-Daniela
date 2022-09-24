const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const email = {};

email.generateEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saluth.org@gmail.com",
        pass: "ftsfukxzoromukhq",
      },
    });

    const options = {
      viewEngine: {
        extName: ".hbs",
        defaultLayout: "template.hbs",
        partialsDir: "src/views/emails/partials",
        layoutsDir: "src/views/emails/layouts",
      },
      viewPath: "src/views/emails",
      extName: ".hbs",
    };

    transporter.use("compile", hbs(options));

    const mailOptions = {
      from: "Saluth",
      to: data.email,
      subject: data.subject,
      template: data.template,
      context: {
        data: data,
      },
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

  } catch (e) {
    console.log(e);
  }
};

module.exports = email;
