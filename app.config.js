const ApplicationModel = require("./models/application.model");
const ModuleModel = require("./models/module.model");
const { name, description, version } = require("../package.json");

(async () => {
  const application = await ApplicationModel.findOne({ name: name }).lean();
  try {
    if (!application) {
      const newApplication = new ApplicationModel({
        name,
        description,
        version,
      });
      await newApplication.save();
    }
  } catch (error) {
    console.log("Error configuring application: ", error);
  }

  const modules = await ModuleModel.find({}).lean();
  try {
    if (application.modules.length > modules.length) {
      await ApplicationModel.findByIdAndUpdate(application._id, {
        $set: { modules: modules.map((module) => module._id) },
      });
    }
  } catch (error) {
    console.log("Error updating application modules: ", error);
  }
})();
