const { Schema, model } = require("mongoose");
const imageSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);
module.exports = model("Image", imageSchema);
