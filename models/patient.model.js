const { Schema, model } = require("mongoose");

const patientSchema = new Schema(
  {
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true},
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Patient", patientSchema);