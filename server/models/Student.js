const mongoose = require("mongoose");
const certificateSchema = require("../models/Certificate");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/,
        "Invalid student name structure.",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    registrationDate: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/,
        "Invalid parent name structure.",
      ],
    },
    attendanceCount: {
      type: Number,
      default: 0,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    branchId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Branch",
    },
    active: {
      type: Boolean,
      default: true,
    },
    certificates: {
      type: [certificateSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;