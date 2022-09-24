var figlet = require("figlet");

const { name, version } = require("../package.json");

figlet("Saluth", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log("");
  console.log(data);
  console.log(`Saluth ${name[0].toUpperCase() + name.slice(1)} v${version}`);
  console.log("");
  console.log("");
});
