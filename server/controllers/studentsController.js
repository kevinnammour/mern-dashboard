const Student = require("../models/Student");
const Branch = require("../models/Branch");

/**
 *
 * @param {Request} req includes the params of the request
 * @param {Response} res response to be returned
 * @returns the requested students and the status code with appropriate message
 */
const getStudents = async (req, res) => {
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
      Student.find(
        { branchId: req.params.branchId },
        "-branchId -createdAt -updatedAt -__v"
      )
        .then((students) => {
          const filteredStudents = students.map((student) => {
            // Extracting the last student certificate instead of sending all certificates
            // and removing attributes that are meaningless in the frontend.
            let certificate;
            if (student.certificates.length !== 0) {
              certificate =
                student.certificates[
                  Object.keys(student.certificates).length - 1
                ];
              delete certificate._doc._id;
              delete certificate._doc.earnedAt;
            }
            delete student._doc.certificates;
            student._doc.certificate = certificate;
            return student;
          });
          return res.status(200).json(filteredStudents);
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
 * @returns status code indicating whether the students was added or not
 */
const addStudent = async (req, res) => {
  if (
    !req?.body?.fullName ||
    !req?.body?.phoneNumber ||
    !req?.body?.registrationDate ||
    !req?.body?.parentName ||
    !req?.body?.dateOfBirth ||
    !req?.body?.branchId
  ) {
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
      const student = new Student({
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        registrationDate: req.body.registrationDate,
        parentName: req.body.parentName,
        dateOfBirth: req.body.dateOfBirth,
        branchId: req.body.branchId,
      });
      student
        .save()
        .then(() => {
          return res.sendStatus(201);
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

/**
 *
 * @param {Request} req includes the body of the request
 * @param {Response} res response to be returned
 * @returns status code indicating whether the students was updated or not
 */
const updateStudentStatus = async (req, res) => {
  if (!req?.body?.studentId || (!req?.body?.active && req.body.active === undefined))
    return res.status(400).json({ message: "Student id or status missing." });

  Student.findOne({ _id: req.body.studentId })
    .then((student) => {
      if (!student) {
        return res.status(400).json({ message: "Student not found." });
      }
      student.active = req.body.active;
      student.save().then(() => {
        return res.status(200).json(student);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

/**
 *
 * @param {Request} req includes the body of the request
 * @param {Response} res response to be returned
 * @returns status code indicating whether the certificate was added or not
 */
const addStudentCertificate = async (req, res) => {
  if (!req?.body?.studentId || !req?.body?.certificateName)
    return res
      .status(400)
      .json({ message: "Student id or certificate missing." });

  Student.findOne({ _id: req.body.studentId })
    .then((student) => {
      if (!student) {
        return res.status(400).json({ message: "Student not found." });
      }
      var ts = new Date().getTime();
      let earnedAt = new Date(ts).toLocaleString("en-US", {
        timeZone: "Asia/Beirut",
      });
      student.certificates.push({ name: req.body.certificateName, earnedAt });
      student.save().then(() => {
        return res.sendStatus(201);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

module.exports = {
  getStudents,
  addStudent,
  updateStudentStatus,
  addStudentCertificate,
};
