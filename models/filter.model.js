const { Schema, model } = require("mongoose");

const filterSchema = new Schema(
  {
    column: { type: String, required: true},
    value: { type: String, required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Filter", filterSchema);
