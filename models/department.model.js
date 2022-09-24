const { Schema, model } = require("mongoose");

const departmentSchema = new Schema(
  {
    name: { type: String },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Department", departmentSchema);
