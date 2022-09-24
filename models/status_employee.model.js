const { Schema, model } = require("mongoose");
const status_employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("Status_Employee", status_employeeSchema);
