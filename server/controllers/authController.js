const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Admin = require("../models/Admin");
const Branch = require("../models/Branch");

const adminUsernameRegex =
  /^(?=.{19,29}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.admin$/;
const partnerUsernameRegex =
  /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/;

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username or password missing!" });
  }

  // Username matches admin username or partner username
  if (adminUsernameRegex.test(username)) {
    Admin.findOne({ username }).then((admin) => {
      validateCrmUser(admin, "Admin", password, res);
    });
  } else if (partnerUsernameRegex.test(username)) {
    Branch.findOne({ username }).then((partner) => {
      validateCrmUser(partner, "Partner", password, res);
    });
  } else {
    return res.status(404).json({
      message: "Username does not exist!",
    });
  }
};

const validateCrmUser = async (crmUser, role, password, res) => {
  // Admin or partner not found
  if (!crmUser) {
    return res.status(404).json({
      message: "Username does not exist!",
    });
  }

  // Validating passwords
  bcrypt.compare(password, crmUser.password).then((match) => {
    if (!match) {
      return res.status(401).json({
        message: "Incorrect password!",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: crmUser._id.toString(),
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      {
        userId: crmUser._id.toString(),
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    Object.assign(crmUser, { accessToken, refreshToken });
    crmUser.save().then(() => {
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken });
    });
  });
};

module.exports = handleLogin;