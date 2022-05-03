const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Branch",
    },
    students: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Student",
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;