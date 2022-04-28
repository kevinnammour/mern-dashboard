// const mongoose = require("mongoose");

// const certificateSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     minlength: 3,
//     trim: true,
//   },
//   earnedAt: {
//     type: String,
//     required: true,
//   },
// });

// const studentSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       minlength: 3,
//       trim: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       minlength: 6,
//     },
//     registrationDate: {
//       type: date,
//       required: true,
//     },
//     parentName: {
//       type: String,
//       required: true,
//       minlength: 3,
//       trim: true,
//     },
//     attendanceCount: {
//       type: int,
//       default: 0,
//       required: true,
//     },
//     dateOfBirth: {
//       type: date,
//       required: true,
//     },
//     branchName: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: "Branch",
//     },

//     active: {
//       type: Boolean,
//       required: true,
//     },

//     certificates: {
//       type: certificateSchema,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// const Student = mongoose.model("Student", studentSchema);
// module.exports = Student;
