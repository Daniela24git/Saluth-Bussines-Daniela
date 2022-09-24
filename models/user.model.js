const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
<<<<<<< HEAD
    avatar: { type:Schema.Types.ObjectId, ref: "Image" },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    settings: { type: Schema.Types.Mixed}
=======
    avatar: { type: Schema.Types.ObjectId, ref: "Image" },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
    Type: { type: Schema.Types.ObjectId, ref: "User_Type" },
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    settings: { type: Schema.Types.Mixed },
>>>>>>> 36ad3bfdeb92e151c572284d93dcb162ee492548
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

<<<<<<< HEAD
module.exports = model("User", userSchema);
=======
module.exports = model("User", userSchema);
>>>>>>> 36ad3bfdeb92e151c572284d93dcb162ee492548
