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
 * @regexExplanation -> @partnerName
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
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
      // @regexExplanation -> @partnerName
      match: [/^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/, 'Invalid partner name structure.'],
    },
    locationUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    percentage: {
      type: double,
      required: true,
    },
    active: {
      type: boolean,
      default: true,
    },
    firstLogin: {
      type: boolean,
      default: true,
    },
    accessToken: {
      type: String,
      trim: true,
      default: null,
    },
    refreshToken: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
