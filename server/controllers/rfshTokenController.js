const jwt = require("jsonwebtoken");
require("dotenv").config();
const Admin = require("../models/Admin");
const Branch = require("../models/Branch");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  let crmUser = await Admin.findOne({ refreshToken });
  let role = "Admin";
  if (!crmUser) {
    crmUser = await Branch.findOne({ refreshToken });
    role = "Partner";
  }

  if (!crmUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || crmUser._id.toString() !== decoded.userId) return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        userId: crmUser._id.toString(),
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ accessToken });
  });
};

module.exports = handleRefreshToken;
