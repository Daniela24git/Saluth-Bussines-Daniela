const { Schema, model } = require("mongoose");

const areaSchema = new Schema(
  {
    name: { type: String },
    departments: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Area", areaSchema);
