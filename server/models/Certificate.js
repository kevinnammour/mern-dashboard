const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  earnedAt: {
    type: String,
    required: true,
  },
});

module.exports = certificateSchema;