const { Schema, model } = require("mongoose");

const personSchema = new Schema(
  {
    identification: {type: Number, required: true, unique: true},
    names: { type: String, required: true },
    surnames: { type: String, required: true },
    birthday: { type: Date },
    phone: { type: Number },
    direction: { type: String },
    province: { type: String },
    canton: { type: String },
    parish: { type: String },
    enabled: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Person", personSchema);
