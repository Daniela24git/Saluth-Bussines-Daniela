const { Schema, model } = require("mongoose");

const user_typeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User_Type", user_typeSchema);
