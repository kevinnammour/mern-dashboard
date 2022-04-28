/**
 *
 * @regexExplanation -> @adminUsername
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
 * @regexExplanation -> @partnerUsername
 *
 *    The partner's username should match /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/
 *
 *    (?=.{21, 31}$)          means that the username should be 21-31 characters long. However, the user enters (5-15) characters because '@ninjaco.partner' is a suffix added by the system itself
 *    (?![_.])                prevents the '_', or '.' character at the beginning of the username
 *    (?!.*[_.]{2})           prevents __ or _. or similar mixtures of 2 or more characters next to each other
 *    [a-zA-Z0-9._]           is the set of allowed characters, (lower/upper)case alphabet letters, and numbers
 *    (?<![_.])               no _ or . at the end of a username
 *    @ninjaco\.partner         means the username should end with '@ninjaco.partner'. Note that this suffix is added by the system itself
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Branch = require("../models/Branch");

// @regexExplanation -> @adminUsername
const adminUsernameRegex =
  /^(?=.{19,29}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.admin$/;

// @regexExplanation -> @partnerUsername
const partnerUsernameRegex =
  /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/;

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing." });
  }

  if (adminUsernameRegex.test(username)) {
    Admin.findOne({ username }).then((admin) => {
      validateCrmUser(admin, "Admin", password, res);
    });
  } else if (partnerUsernameRegex.test(username)) {
    Branch.findOne({ username }).then((branch) => {
      validateCrmUser(branch, "Partner", password, res);
    });
  } else {
    return res.status(404).json({
      message: "Username does not exist.",
    });
  }
};

const validateCrmUser = async (crmUser, role, password, res) => {
  // 404 Not found if username does not exist
  if (!crmUser) {
    return res.status(404).json({
      message: "Username does not exist.",
    });
  }

  // If the partner signed for the first time, they need to reset their password
  if (role === "Partner" && crmUser.firstLogin) {
    return res.status(205).json({ message: "User needs to reset password." });
  }

  bcrypt.compare(password, crmUser.password).then((match) => {
    if (!match) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: crmUser._id.toString(),
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );

    const refreshToken = jwt.sign(
      {
        userId: crmUser._id.toString(),
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    Object.assign(crmUser, { accessToken, refreshToken });
    crmUser
      .save()
      .then(() => {
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          // secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ accessToken, role });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "Internal Server Error: Could not save user." });
      });
  });
};

module.exports = { handleLogin };
