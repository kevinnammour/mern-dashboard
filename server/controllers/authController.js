const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    Partner.findOne({ username }).then((partner) => {
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
        userId: crmUser._id,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        userId: crmUser._id,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
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

module.exports = handleLogin;
