const { Schema, model } = require("mongoose");
const employeeSchema = new Schema(
  {
    medical_branch:{type: Schema.Types.ObjectId, ref: "Medical_Branch"},
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
<<<<<<< HEAD
    position: { type: Schema.Types.ObjectId, ref: "Position", required: true },
    area: { type: Schema.Types.ObjectId, ref: "Area" },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
=======
    position: { type: Schema.Types.ObjectId, ref: "Position"},
    department: { type: Schema.Types.ObjectId, ref: "Department"},
>>>>>>> 36ad3bfdeb92e151c572284d93dcb162ee492548
    schedule: { type: Schema.Types.ObjectId, ref: "Schedule" },
    status: { type: Schema.Types.ObjectId, ref: "Status_Employee" },
    enabled: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("Employee", employeeSchema);
