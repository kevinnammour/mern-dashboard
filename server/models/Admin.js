const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;