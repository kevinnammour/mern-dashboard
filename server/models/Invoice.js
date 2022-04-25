const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    amount: {
      type: double,
      required: true,
    },
    lbpRate: {
      type: double,
    },
    datetime: {
      type: date,
      required: true,
    },
    branchName: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Branch",
    },
    studentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Student",
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
