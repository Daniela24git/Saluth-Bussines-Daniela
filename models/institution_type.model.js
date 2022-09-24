const { Schema, model } = require("mongoose");

const institution_typeSchema = new Schema(
  {
    name: { type: String, required: true , unique: true},
    status: { type: String, required: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Institution_Type", institution_typeSchema);
