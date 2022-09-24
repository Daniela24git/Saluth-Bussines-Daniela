const { Schema, model } = require("mongoose");

const positionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    salary: { type: Number, required: true },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Position", positionSchema);
