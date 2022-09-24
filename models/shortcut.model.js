const { Schema, model } = require("mongoose");

const shorcutSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Shorcut", shorcutSchema);
