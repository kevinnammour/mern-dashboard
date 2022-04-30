const bcrypt = require("bcrypt");
const Branch = require("../models/Branch");

const handleResetPassword = async (req, res) => {
  if (!req?.body?.username || !req?.body?.password || !req?.body?.newPassword)
    return res.status(400).json({ message: "Some fields are missing." });
  Branch.findOne({ username: req.body.username }).then((branch) => {
    if (!branch) {
      return res.status(404).json({ message: "Username does not exist." });
    }

    bcrypt.compare(req.body.password, branch.password).then((match) => {
      if (!match) {
        return res.status(401).json({ message: "Incorrect password." });
      }
      if (!branch.firstLogin) {
        return res.status(405).json({ message: "Reset password not allowed." });
      }

      if (
        !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          req.body.newPassword
        )
      ) {
        return res.status(400).json({ message: "Password structure is weak." });
      }

      bcrypt
        .hash(req.body.newPassword, 10)
        .then((hash) => {
          branch.password = hash;
          branch.firstLogin = false;
          branch
            .save()
            .then(() => {
              return res.sendStatus(200);
            })
            .catch((err) => {
              return res.status(500).json({
                message: "Internal Server Error: Could not save user.",
              });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Internal Server Error: Could not hash password.",
          });
        });
    });
  });
};

module.exports = {
  handleResetPassword,
};
