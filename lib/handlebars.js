const Handlebars = require("handlebars");

const helpers = {};

Handlebars.registerHelper("formatDateTime", function (date) {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
});

Handlebars.registerHelper("formatDate", function (date) {
  const month = date.getMonth() + 1;
  if (month < 10) {
    return date.getFullYear() + "-0" + month + "-" + date.getDate();
  } else {
    return date.getFullYear() + "-" + month + "-" + date.getDate();
  }
});

Handlebars.registerHelper("formatTime", function (date) {
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  if (minutes < 10) {
    if (seconds < 10) {
      return minutes + ":0" + seconds;
    } else {
      return minutes + ":" + seconds;
    }
  }
  if (seconds < 10) {
    return minutes + ":0" + seconds;
  }
  return minutes + ":" + seconds;
});

//numeros a fecha
Handlebars.registerHelper("formatDateNumber", function (date) {
  return new Date(date);
});

Handlebars.registerHelper("toCapitalCase", function (text) {
  return text[0].toUpperCase() + text.toLowerCase().slice(1);
});

Handlebars.registerHelper("toLowerCase", function (text) {
  return text.toLowerCase();
});

Handlebars.registerHelper("length", function (list) {
  return list.length;
});

Handlebars.registerHelper("equal", function (v1, v2) {
  return v1.toString() === v2.toString();
});

Handlebars.registerHelper("greaterThan", function (v1, v2) {
  return v1.length > v2;
});

<<<<<<< HEAD
=======
Handlebars.registerHelper("for", function (n, block) {
  var count = "";
  for (var i = 0; i < n; ++i) count += block.fn(i);
  return count;
});

Handlebars.registerHelper("auth", function (user_permissions, module_permissions) {
  user_permissions = user_permissions.map((item) => item.toString());
  module_permissions = module_permissions.map((item) => item.toString());

  for (let i = 0; i < user_permissions.length; i++) {
    if (module_permissions.includes(user_permissions[i])) {
      return true;
    }
  }
  return false;
});

>>>>>>> 36ad3bfdeb92e151c572284d93dcb162ee492548
Handlebars.registerHelper("calculateAge", function (date) {
  var today = new Date();
  var birthDate = new Date(date);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

<<<<<<< HEAD
=======

>>>>>>> 36ad3bfdeb92e151c572284d93dcb162ee492548
module.exports = helpers;
