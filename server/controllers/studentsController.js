const Student = require("../models/Student");
const Branch = require("../models/Branch");

const getRequestedStudents = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Branch id required." });
  Branch.exists({ _id: req.params.id })
    .then((branchExists) => {
      if (!branchExists) {
        // If the id has a correct format, but no branch has that id
        return res
          .status(404)
          .json({ message: `No branch with id = ${req.params.id}.` });
      }
      Student.find(
        { branchId: req.params.id },
        "-branchId -createdAt -updatedAt -__v"
      )
        .then((students) => {
          return res.status(200).json({ students });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      // If the id has incorrect format.
      return res
        .status(404)
        .json({ message: `No branch with id = ${req.params.id}.` });
    });
};

const getBranchStudents = async (req, res) => {
  if (!req?.role) {
    return res.sendStatus(401);
  }
  Branch.exists({ _id: req.userId })
    .then((branchExists) => {
      if (!branchExists) {
        // If the id has a correct format, but no branch has that id
        return res
          .status(404)
          .json({ message: `No branch with id = ${req.userId}.` });
      }
      Student.find(
        { branchId: req.userId },
        "-branchId -createdAt -updatedAt -__v"
      )
        .then((students) => {
          return res.status(200).json({ students });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      // If the id has incorrect format.
      return res
        .status(404)
        .json({ message: `No branch with id = ${req.userId}.` });
    });
};

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

const updateStudentStatus = async (req, res) => {
  if (!req?.body?.id || (!req?.body?.active && req.body.active === undefined))
    return res.status(400).json({ message: "Student id or status missing." });

  Student.findOne({ _id: req.body.id })
    .then((student) => {
      if (!student) {
        return res.status(400).json({ message: "Student not found." });
      }
      student.active = req.body.active;
      student.save().then(() => {
        return res.sendStatus(200);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const addStudentCertificate = async (req, res) => {
  if (!req?.body?.id || !req?.body?.certificateName)
    return res
      .status(400)
      .json({ message: "Student id or certificate missing." });

  Student.findOne({ _id: req.body.id })
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
  getRequestedStudents,
  getBranchStudents,
  addStudent,
  updateStudentStatus,
  addStudentCertificate,
};
