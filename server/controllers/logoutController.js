const Admin = require("../models/Admin");
const Branch = require("../models/Branch");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  let crmUser = await Admin.findOne({ refreshToken });
  let role = "Admin";
  if (!crmUser) {
    crmUser = await Branch.findOne({ refreshToken });
    role = "Partner";
  }

  if (!crmUser) {
    res.clearCookie("jwt", { HttpOnly: true });
    return res.sendStatus(204);
  }

  Object.assign(crmUser, { refreshToken: "" });
  crmUser.save().then(() => {
    // Set secure to true as well in production mode
    res.clearCookie("jwt", { HttpOnly: true });
    res.sendStatus(204);
  });
};

module.exports = handleLogout;
