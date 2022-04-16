const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minlength: 6,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minlengh: 8,
    },
  },
  {
    timestamps: true,
  }
);

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;