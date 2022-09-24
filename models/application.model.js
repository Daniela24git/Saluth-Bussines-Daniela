const { Schema, model } = require("mongoose");

const applicationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    version: { type: String, required: true },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    modules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Application", applicationSchema);
