const { Schema, model } = require("mongoose");

const scheduleSchema = new Schema(
  {
    start_time: { type: Date },
    end_time: { type: Date },
    lunch_time: { type: Date },
    enable: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Schedule", scheduleSchema);
