const { Schema, model } = require("mongoose");

const medical_institutionSchema = new Schema(
  {
    ruc: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    logo: { type: Schema.Types.ObjectId, ref: "Image" },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    type: { type: Schema.Types.ObjectId, ref: "Institution_Type", required: true },
    medical_branches: [{ type: Schema.Types.ObjectId, ref: "Medical_Branch" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Medical_Institution", medical_institutionSchema);
