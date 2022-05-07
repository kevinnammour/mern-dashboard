const Invoice = require("../models/Invoice");
const Branch = require("../models/Branch");

const getTotalIncome = async (req, res) => {
  var starter = new Date();
  starter.setDate(starter.getDate() - 29);
  let data = [];
  var i = 1;
  while (i <= 30) {
    var starterStr = starter.toLocaleString("en-US", {
      timeZone: "Asia/Beirut",
    });
    data.push([starterStr.substring(0, starterStr.indexOf(",")), 0]);
    starter = new Date(starter.getTime() + 86400000);
    i++;
  }

  Invoice.find({}, "-createdAt -updatedAt -__v")
    .then(async (invoices) => {
      const promise = invoices.map((invoice) => {
        var formattedDatetime = invoice.datetime.substring(
          0,
          invoice.datetime.indexOf(",")
        );
        for (let i = 0; i < data.length; i++) {
          if (data[i][0] === formattedDatetime) {
            data[i][1] += invoice.amount;
          }
        }
      });
      await Promise.all(promise);
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const getBranchesIncome = async (req, res) => {
  var ts = new Date().getTime();
  let date = new Date(ts).toLocaleString("en-US", {
    timeZone: "Asia/Beirut",
  });
  currDay = date.substring(0, date.indexOf(","));
  var today = new Date(currDay);

  let xAxisCategories = [];
  let seriesData = [];
  let branchIds = [];

  Branch.find({}, "name")
    .then((branches) => {
      for (let branch of branches) {
        branchIds.push(branch._id);
        xAxisCategories.push(branch.name);
        seriesData.push(0);
      }
      Invoice.find({}, "branchId amount datetime").then(async (invoices) => {
        const promise = invoices.map((invoice) => {
          var formattedDatetime = invoice.datetime.substring(
            0,
            invoice.datetime.indexOf(",")
          );
          if (
            Math.floor(
              Math.abs(today - new Date(formattedDatetime)) /
                (1000 * 60 * 60 * 24) <=
                30
            )
          ) {
            for (let i = 0; i < branchIds.length; i++) {
              if (branchIds[i].toString() == invoice.branchId.toString()) {
                seriesData[i] += invoice.amount;
              }
            }
          }
        });
        await Promise.all(promise);
        return res.status(200).json({xAxisCategories, seriesData});
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const getBranchIncome = async (req, res) => {
  if (!req?.params?.branchId) {
    return res.status(400).json({ message: "Branch id required." });
  }
};

module.exports = {
  getTotalIncome,
  getBranchesIncome,
  getBranchIncome,
};
