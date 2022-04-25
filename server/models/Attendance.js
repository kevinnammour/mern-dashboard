const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    branchName: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Branch",
    },
    students: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
