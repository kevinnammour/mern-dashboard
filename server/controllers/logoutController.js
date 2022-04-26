const Admin = require("../models/Admin");
const Branch = require("../models/Branch");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  let crmUser = await Admin.findOne({ refreshToken });
  let role = "Admin";
  if (!crmUser) {
    crmUser = await Branch.findOne({ refreshToken });
    role = "Partner";
  }

  if (!crmUser) {
    res.clearCookie("jwt", { HttpOnly: true, secure: true, sameSite: "None" });
    return res.sendStatus(204);
  }

  Object.assign(crmUser, { refreshToken: "" });
  crmUser
    .save()
    .then(() => {
      res.clearCookie("jwt", {
        HttpOnly: true,
        // secure: true,
        sameSite: "None",
      });
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = handleLogout;
