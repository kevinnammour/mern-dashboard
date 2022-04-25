/**
 *
 * @regexExplanation -> @username
 *
 *    The admin's username should match /^(?=.{19,29}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.admin$/
 *
 *    (?=.{19, 29}$)          means that the username should be 19-29 characters long. However, the user enters (5-15) characters because '@ninjaco.admin' is a suffix added by the system itself
 *    (?![_.])                prevents the '_', or '.' character at the beginning of the username
 *    (?!.*[_.]{2})           prevents __ or _. or similar mixtures of 2 or more characters next to each other
 *    [a-zA-Z0-9._]           is the set of allowed characters, (lower/upper)case alphabet letters, and numbers
 *    (?<![_.])               no _ or . at the end of a username
 *    @ninjaco\.admin         means the username should end with '@ninjaco.admin'. Note that this suffix is added by the system itself
 *
 */

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // @regexExplanation -> @username
      match: [
        /^(?=.{19,29}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.admin$/,
        "Invalid username structure.",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      trim: true,
    },
    accessToken: {
      type: String,
      trim: true,
      default: null,
      unique: true,
    },
    refreshToken: {
      type: String,
      trim: true,
      default: null,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
