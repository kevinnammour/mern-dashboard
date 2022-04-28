const Inquiry = require("../models/Inquiry");

const getUnsolvedInquiries = async (req, res) => {
  Inquiry.find({ isSolved: false }, "-isSolved -createdAt -updatedAt -__v")
    .then((inquiries) => {
      return res.status(200).json({ inquiries });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const addInquiry = async (req, res) => {
  if (
    !req?.body?.fullName ||
    !req?.body?.phoneNumber ||
    !req?.body?.message ||
    !req?.body?.type
  ) {
    return res.status(400).json({ message: "Some fields are missing." });
  }

  const inquiry = new Inquiry({
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    message: req.body.message,
    type: req.body.type,
  });
  inquiry
    .save()
    .then(() => {
      return res.sendStatus(201);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const solveInquiry = async (req, res) => {
  if (!req?.body?.inquiryId) {
    return res.status(400).json({ message: "Inquiry id missing." });
  }
  Inquiry.findOne({ _id: req.body.inquiryId })
    .then((inquiry) => {
      if (!inquiry) {
        return res.status(400).json({ message: "Inquiry not found." });
      }
      inquiry.isSolved = true;
      inquiry.save().then(() => {
        return res.sendStatus(200);
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

module.exports = {
  getUnsolvedInquiries,
  addInquiry,
  solveInquiry,
};
