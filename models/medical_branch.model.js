const { Schema, model } = require("mongoose");

const medical_branchSchema = new Schema(
  {
    name: { type: String, required: true , unique: true},
    province: { type: String , required: true},
    canton: { type: String , required: true},
    parish: { type: String , required: true},
    direction: { type: String, required: true },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Branch_Category" , required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Medical_Branch", medical_branchSchema);
