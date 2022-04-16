const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Admin = require("../models/Admin");
const Partner = require("../models/Partner");
const { SECRET } = require("../config/env");

const adminUsernameRegex =
  /^(?=.{19,29}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.admin$/;
const partnerUsernameRegex =
  /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/;

const crmUserLogin = async (credentials, res) => {
  let { username, password } = credentials;

  // Username matches admin username or partner username
  if (adminUsernameRegex.test(username)) {
    Admin.findOne({ username }).then((admin) => {
      validate(admin, "Admin", password, res);
    });
  } else if (partnerUsernameRegex.test(username)) {
    Partner.findOne({ username }).then((partner) => {
      validate(partner, "Partner", password, res);
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Username not found.",
    });
  }
};

const validate = async (crmUser, role, password, res) => {
  // Admin or partner not found
  if (!crmUser) {
    return res.status(404).json({
      success: false,
      message: "Username not found.",
    });
  }
  // Validating passwords
  bcrypt.compare(password, crmUser.password).then((match) => {
    if (!match) {
      return res.status(403).json({
        success: false,
        message: "Wrong password.",
      });
    }

    // If the password matches
    let token = jwt.sign(
      {
        userId: crmUser._id,
        username: crmUser.username,
        role,
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    let result = {
      username: crmUser.username,
      role,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      success: true,
      message: "Access granted.",
    });
  });
};

const crmUserAuth = passport.authenticate("jwt", { session: false });

const filterCrmUser = (user) => {
  return {
    _id: user._id,
    username: user.username,
  };
};

const checkCrmUserRole = (permission) => (req, res, next) => {
  let userRole;
  if (adminUsernameRegex.test(req.user.username)) {
    userRole = "Admin";
  } else if (partnerUsernameRegex.test(req.user.username)) {
    userRole = "Partner";
  }
  userRole === permission? next() : res.status(401).json("Unauthorized");
};

module.exports = {
  crmUserLogin,
  crmUserAuth,
  filterCrmUser,
  checkCrmUserRole,
};
