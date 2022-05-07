const Invoice = require("../models/Invoice");
const Branch = require("../models/Branch");
const Student = require("../models/Student");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getTotalIncome = async (req, res) => {
  var starter = new Date();
  starter.setDate(starter.getDate() - 29);
  let data = [];
  var i = 1;
  while (i <= 30) {
    var starterStr = starter.toLocaleString("en-US", {
      timeZone: "Asia/Beirut",
    });
    data.push([starterStr.substring(0, starterStr.indexOf(",")), 0]);
    starter = new Date(starter.getTime() + 86400000);
    i++;
  }

  Invoice.find({}, "-createdAt -updatedAt -__v")
    .then(async (invoices) => {
      const promise = invoices.map((invoice) => {
        var formattedDatetime = invoice.datetime.substring(
          0,
          invoice.datetime.indexOf(",")
        );
        for (let i = 0; i < data.length; i++) {
          if (data[i][0] === formattedDatetime) {
            data[i][1] += invoice.amount;
          }
        }
      });
      await Promise.all(promise);
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const getBranchesIncome = async (req, res) => {
  var ts = new Date().getTime();
  let date = new Date(ts).toLocaleString("en-US", {
    timeZone: "Asia/Beirut",
  });
  currDay = date.substring(0, date.indexOf(","));
  var today = new Date(currDay);

  let xAxisCategories = [];
  let seriesData = [];
  let branchIds = [];

  Branch.find({}, "name")
    .then((branches) => {
      for (let branch of branches) {
        branchIds.push(branch._id);
        xAxisCategories.push(branch.name);
        seriesData.push(0);
      }
      Invoice.find({}, "branchId amount datetime").then(async (invoices) => {
        const promise = invoices.map((invoice) => {
          var formattedDatetime = invoice.datetime.substring(
            0,
            invoice.datetime.indexOf(",")
          );
          if (
            Math.floor(
              Math.abs(today - new Date(formattedDatetime)) /
                (1000 * 60 * 60 * 24) <=
                30
            )
          ) {
            for (let i = 0; i < branchIds.length; i++) {
              if (branchIds[i].toString() == invoice.branchId.toString()) {
                seriesData[i] += invoice.amount;
              }
            }
          }
        });
        await Promise.all(promise);
        return res.status(200).json({ xAxisCategories, seriesData });
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const getBranchIncome = async (req, res) => {
  if (!req?.params?.branchId) {
    return res.status(400).json({ message: "Branch id required." });
  }

  let xAxisCategories = [];
  let seriesData = [];

  var today = new Date();
  var d;
  var month;
  var year;
  for (var i = 5; i > 0; i -= 1) {
    d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    month = monthNames[d.getMonth()];
    year = d.getFullYear();
    xAxisCategories.push(`${month}, ${year}`);
    seriesData.push(0);
  }
  today = new Date();
  d = new Date(today.getFullYear(), today.getMonth(), 1);
  month = monthNames[d.getMonth()];
  year = d.getFullYear();
  xAxisCategories.push(`${month}, ${year}`);
  seriesData.push(0);

  Invoice.find({ branchId: req?.params?.branchId })
    .then(async (invoices) => {
      const promise = invoices.map((invoice) => {
        var invoiceDate = new Date(invoice.datetime);
        invoiceDate = new Date(
          invoiceDate.getFullYear(),
          invoiceDate.getMonth(),
          1
        );
        var monthYear = `${
          monthNames[invoiceDate.getMonth()]
        }, ${invoiceDate.getFullYear()}`;

        for (let i = 0; i < xAxisCategories.length; i++) {
          if (xAxisCategories[i] == monthYear) {
            seriesData[i] += invoice.amount;
          }
        }
      });
      await Promise.all(promise);
      return res.status(200).json({ xAxisCategories, seriesData });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const getHighestAttendingStudents = async (req, res) => {
  Student.find({ attendanceCount: { $gte: 1 } }, "-createdAt -updatedAt -__v")
    .then(async (students) => {
      const filteredStudents = students.map((student) => {
        // Extracting the last student certificate instead of sending all certificates
        // and removing attributes that are meaningless in the frontend.
        let certificate;
        if (student.certificates.length > 0) {
          certificate =
            student.certificates[Object.keys(student.certificates).length - 1];
          delete certificate._doc._id;
          delete certificate._doc.earnedAt;
        }
        delete student._doc.certificates;
        student._doc.certificate = certificate;
        return student;
      });
      filteredStudents.sort(function (a, b) {
        return a.attendanceCount > b.attendanceCount
          ? -1
          : b.attendanceCount > a.attendanceCount
          ? 1
          : 0;
      });
      let attendingStudents = [];
      var score = 0;
      let value = -1;
      for (let student of filteredStudents) {
        if (value != student.attendanceCount) {
          value = student.attendanceCount;
          score += 1;
          if (score === 6) {
            break;
          }
        }
        attendingStudents.push(student);
      }
      const promise = attendingStudents.map(async (student) => {
        await Branch.findOne({ _id: student.branchId }, "name").then(
          (branch) => {
            student._doc.branchName = branch.name;
            delete student._doc.branchId;
          }
        );
      });
      await Promise.all(promise);
      return res.status(200).json(attendingStudents);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

module.exports = {
  getTotalIncome,
  getBranchesIncome,
  getBranchIncome,
  getHighestAttendingStudents,
};
