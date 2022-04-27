const axios = require("axios");
const Invoice = require("../models/Invoice");
const Student = require("../models/Student");

const addInvoice = async (req, res) => {
  if (!req?.body?.amount || !req?.body?.datetime || !req?.body?.studentId)
    res.status(400).json({ message: "Some fields are missing." });

  await Student.exists({ _id: req.body.studentId }).then((studentExists) => {
    if (studentExists) {
      const invoice = new Invoice({
        amount: req.body.amount,
        datetime: req.body.datetime,
        branchId: req.userId,
        studentId: req.body.studentId,
      });

      var timestamp = new Date().getTime();
      let date_string = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Asia/Beirut",
      });
      console.log(date_string);

    //   axios.get(
    //     "https://lirarate.org/wp-json/lirarate/v2/omt?currency=LBP&_ver=t$ver"
    //   );
    //   invoice
    //     .save()
    //     .then(() => res.sendStatus(201))
    //     .catch((err) => {
    //       res.status(500).json({ message: "Internal error." });
    //     });
    } else {
      res.status(404).json({ message: "Student not found." });
    }
  });
};

module.exports = {
  addInvoice,
};
