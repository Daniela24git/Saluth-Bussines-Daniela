const { Schema, model } = require("mongoose");

const branch_CategorySchema = new Schema(
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

module.exports = model("Branch_Category", branch_CategorySchema);
