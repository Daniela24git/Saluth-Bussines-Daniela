const { Schema, model } = require("mongoose");

const moduleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    url: { type: String, required: true },
    icon: { type: String, required: true },
    type: { type: Schema.Types.ObjectId, ref: "Module_Type" },
    category: { type: Schema.Types.ObjectId, ref: "Module_Category" },
    modules: { type: Schema.Types.ObjectId, ref: "Module" },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Module", moduleSchema);
