const axios = require("axios");
const Invoice = require("../models/Invoice");
const Student = require("../models/Student");
const lirarateApi =
  "https://lirarate.org/wp-json/lirarate/v2/omt?currency=LBP&_ver=t";

/**
 *
 * @param {Request} req includes the params of the request
 * @param {Response} res response to be returned
 * @returns the requested invoices and the status code with appropriate message
 */
const getInvoices = async (req, res) => {
  if (!req?.params?.branchId)
    return res.status(400).json({ message: "Branch id required." });

  Invoice.find({ branchId: req.params.branchId }, "-createdAt -updatedAt -__v")
    .then(async (invoices) => {
      const promise = invoices.map(async (invoice) => {
        await Student.findOne(
          { _id: invoice?.studentId },
          "fullName phoneNumber"
        ).then((student) => {
          delete invoice._doc.branchId;
          delete invoice._doc.studentId;
          invoice._doc.student = student;
        });
      });
      await Promise.all(promise);
      return res.status(200).json(invoices);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

/**
 *
 * @param {Request} req includes the body of the request
 * @param {Response} res response to be returned
 * @returns status code indicating whether the invoice was added or not
 */
const addInvoice = async (req, res) => {
  if (
    !req?.body?.amount ||
    !req?.body?.datetime ||
    !req?.body?.studentId ||
    !req?.body?.branchId
  )
    res.status(400).json({ message: "Some fields are missing." });

  await Student.findOne({ _id: req.body.studentId }, "fullName phoneNumber")
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }

      // Building the suffix of the lirarate api
      var timestamp = new Date().getTime();
      let date_string = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Asia/Beirut",
      });

      let year, month, day, hour;
      try {
        var splitSpace = date_string.split(" ");
        var splitSlash = splitSpace[0].split("/");
        month = splitSlash[0];
        day = splitSlash[1];
        year = splitSlash[2];
        year = year.substring(0, year.length - 1);
        hour = parseInt(splitSpace[1].split(":")[0]);
        if (splitSpace[2] === "PM") {
          hour += 12;
        }
      } catch (err) {}

      let lbpRate;

      axios
        .get(`${lirarateApi}${year}${month}${day}${hour}`)
        .then((response) => {
          lbpRate = response?.data["omt"][response?.data["omt"].length - 1][1];
        })
        .catch((err) => {})
        .finally(() => {
          const invoice = new Invoice({
            amount: req.body.amount,
            datetime: req.body.datetime,
            branchId: req.body.branchId,
            studentId: req.body.studentId,
            lbpRate,
          });
          invoice
            .save()
            .then(() => {
              delete invoice._doc.createdAt;
              delete invoice._doc.updatedAt;
              delete invoice._doc.__v;
              delete invoice._doc.branchId;
              delete invoice._doc.studentId;
              invoice._doc.student = student;
              return res.status(201).json(invoice);
            })
            .catch((err) => {
              return res.status(500).json({ message: err.message });
            });
        });
    })
    .catch((err) => {
      // If the id has incorrect format.
      return res.status(404).json({ message: err.message });
    });
};

/**
 *
 * @param {Request} req includes the body of the request
 * @param {Response} res response to be returned
 * @returns status code indicating whether the invoice was updated or not
 */
const updateLbpRate = async (req, res) => {
  if (!req?.body?.invoiceId || !req?.body?.lbpRate) {
    return res.status(400).json({ message: "Invoice id or lbp rate missing." });
  }

  Invoice.findOne(
    { _id: req.body.invoiceId },
    "-createdAt -updatedAt -__v -branchId"
  )
    .then((invoice) => {
      if (!invoice) {
        return res.status(400).json({ message: "Invoice not found." });
      }
      invoice.lbpRate = req.body.lbpRate;
      invoice.save().then(async () => {
        await Student.findOne(
          { _id: invoice?.studentId },
          "fullName phoneNumber"
        ).then((student) => {
          delete invoice._doc.studentId;
          invoice._doc.student = student;
        });
        return res.status(200).json(invoice);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

module.exports = {
  addInvoice,
  getInvoices,
  updateLbpRate,
};
