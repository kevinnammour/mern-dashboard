const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions"); //what is this

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 6,
    },
    message: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
    },
    type: {
      type: boolean,
      required: true,
    },
    isSolved: {
      type: boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
