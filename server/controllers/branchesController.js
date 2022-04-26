const Branch = require("../models/Branch");
const bcrypt = require("bcrypt");

const getBranch = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Branch id required." });

  Branch.findOne(
    { _id: req.params.id },
    "-password -accessToken -refreshToken -createdAt -updatedAt -__v"
  ).then((branch) => {
    if (!branch)
      return res
        .status(204)
        .json({ message: `No branch with id = ${req.params.id}` });
    delete branch.refreshToken;
    res.status(200).json(branch);
  });
};

const addBranch = async (req, res) => {
  if (
    !req?.body?.username ||
    !req?.body?.password ||
    !req?.body?.name ||
    !req?.body?.phoneNumber ||
    !req?.body?.partnerName ||
    !req?.body?.locationUrl ||
    !req?.body?.percentage
  )
    res.status(400).json({ message: "Some fields are missing." });

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const branch = new Branch({
      username: req.body.username,
      password: hash,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      partnerName: req.body.partnerName,
      percentage: req.body.percentage,
      locationUrl: req.body.locationUrl,
    });
    branch
      .save()
      .then(() => res.sendStatus(201))
      .catch((err) => {
        if (err.code === 11000) {
          res.status(409).json({
            message: "Username, branch name, or location url already exists.",
          });
        } else {
          res.status(500).json({ message: err.message });
        }
      });
  });
};

const updateBranchStatus = async (req, res) => {
  if (!req?.body?.id || (!req?.body?.active && req.body.active === undefined))
    res.status(400).json({ message: "Branch id or status required." });

  Branch.findOne({ _id: req.body.id }).then((branch) => {
    branch.active = req.body.active;
    branch
      .save()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  });
};

module.exports = {
  getBranch,
  addBranch,
  updateBranchStatus,
};
