const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Role", roleSchema);
