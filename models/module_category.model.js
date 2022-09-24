const { Schema, model } = require("mongoose");

const module_CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Module_Category", module_CategorySchema);
