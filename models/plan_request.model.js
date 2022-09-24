const { Schema, model } = require("mongoose");

const plan_requestSchema = new Schema(
  {
    description: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: 'pendiente'},
    archived: { type: Boolean, default: false },
    person: { type: Schema.Types.ObjectId, ref: "Person" ,required: true},
    medical_institution: { type: Schema.Types.ObjectId, ref: "Medical_Institution" ,required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Plan_Request", plan_requestSchema);
