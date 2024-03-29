/**
 *
 * @regexExplanation -> @username
 *
 *    The partner's username should match /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/
 *
 *    (?=.{21, 31}$)          means that the username should be 21-31 characters long. However, the user enters (5-15) characters because '@ninjaco.partner' is a suffix added by the system itself
 *    (?![_.])                prevents the '_', or '.' character at the beginning of the username
 *    (?!.*[_.]{2})           prevents __ or _. or similar mixtures of 2 or more characters next to each other
 *    [a-zA-Z0-9._]           is the set of allowed characters, (lower/upper)case alphabet letters, and numbers
 *    (?<![_.])               no _ or . at the end of a username
 *    @ninjaco\.partner         means the username should end with '@ninjaco.partner'. Note that this suffix is added by the system itself
 *
 * @regexExplanation -> @branchAndPartnerName
 *
 *    The partner's name should match /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/
 *
 *    This regex that supports most languages and only allows for word characters.
 *    It also supports some special characters like hyphens, spaces and apostrophes.
 *    It should have a minimum length of 2
 *
 */

const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
      trim: true,
      unique: true,
      // @regexExplanation -> @username
      match: [
        /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/,
        "Invalid username structure.",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // @regexExplanation -> @branchAndPartnerName
      match: [
        /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/,
        "Invalid branch name structure.",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Invalid phone number structure.",
      ],
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
      // @regexExplanation -> @branchAndPartnerName
      match: [
        /^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/,
        "Invalid partner name structure.",
      ],
    },
    locationUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
    accessToken: {
      type: String,
      trim: true,
      default: "",
    },
    refreshToken: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
