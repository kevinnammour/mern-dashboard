const Attendance = require("../models/Attendance");
const Branch = require("../models/Branch");
const Student = require("../models/Student");

/**
 *
 * @param {Request} req includes the params of the request
 * @param {Response} res response to be returned
 * @returns the requested sheets and the status code with appropriate message
 */
const getAttendanceSheets = async (req, res) => {
  if (!req?.params?.branchId)
    return res.status(400).json({ message: "Branch id required." });
  Branch.exists({ _id: req.params.branchId })
    .then((branchExists) => {
      if (!branchExists) {
        // If the id has a correct format, but no branch has that id
        return res
          .status(404)
          .json({ message: `No branch with id = ${req.params.branchId}.` });
      }
      Attendance.find(
        { branchId: req.params.branchId },
        "-branchId -createdAt -updatedAt -__v"
      )
        .then(async (attendances) => {
          var ts = new Date().getTime();
          let date = new Date(ts).toLocaleString("en-US", {
            timeZone: "Asia/Beirut",
          });
          currDay = date.substring(0, date.indexOf(","));
          var today = new Date(currDay);
          const filteredAttendances = attendances.filter((attendance) => {
            // Removing sheets that are older then 30 days
            var attendanceDayStr = attendance.date.substring(
              0,
              attendance.date.indexOf(",")
            );
            var attendanceDay = new Date(attendanceDayStr);
            var difference = Math.abs(today - attendanceDay);
            days = difference / (1000 * 3600 * 24);
            if (days <= 30) {
              return attendance;
            }
          });
          // Adding students information in each sheet
          const promise = filteredAttendances.map(async (sheet) => {
            studentsSheet = sheet.students;
            delete sheet._doc.students;
            if (studentsSheet.length > 0) {
              sheet._doc.students = [];
              for (let studentId of studentsSheet) {
                await Student.findOne(
                  { _id: studentId },
                  "fullName phoneNumber"
                ).then((student) => {
                  sheet._doc.students.push(student);
                });
              }
            }
          });
          await Promise.all(promise);
          return res.status(200).json(filteredAttendances);
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      // If the id has incorrect format.
      return res
        .status(404)
        .json({ message: `No branch with id = ${req.params.branchId}.` });
    });
};

/**
 *
 * @param {Request} req includes the body of the request
 * @param {Response} res response to be returned
 * @returns status code indicating whether the attendance sheet was added or not
 */
const addAttendanceSheet = async (req, res) => {
  if (!req?.body?.branchId || !req?.body?.students) {
    return res.status(400).json({ message: "Some fields are missing." });
  }
  Branch.exists({ _id: req.body.branchId })
    .then((branchExists) => {
      if (!branchExists) {
        // If the id has a correct format, but no branch has that id
        return res
          .status(404)
          .json({ message: `No branch with id = ${req.body.branchId}.` });
      }
      var ts = new Date().getTime();
      let date = new Date(ts).toLocaleString("en-US", {
        timeZone: "Asia/Beirut",
      });
      const attendance = new Attendance({
        branchId: req.body.branchId,
        students: req.body.students,
        date,
      });
      attendance
        .save()
        .then(async () => {
          delete attendance._doc.branchId;
          delete attendance._doc.__v;
          delete attendance._doc.createdAt;
          delete attendance._doc.updatedAt;

          studentsSheet = attendance.students;
          delete attendance._doc.students;
          if (studentsSheet.length > 0) {
            attendance._doc.students = [];
            for (let studentId of studentsSheet) {
              await Student.findOne(
                { _id: studentId },
                "fullName phoneNumber attendanceCount"
              ).then(async (student) => {
                student.attendanceCount += 1;
                attendance._doc.students.push(student);
                await student.save();
              });
            }
          }
          return res.status(201).json(attendance);
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      // If the id has incorrect format.
      return res
        .status(404)
        .json({ message: `No branch with id = ${req.body.branchId}.` });
    });
};

module.exports = {
  getAttendanceSheets,
  addAttendanceSheet,
};