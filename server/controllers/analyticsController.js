const Invoice = require("../models/Invoice");

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

const getBranchesIncome = async (req, res) => {};

const getBranchIncome = async (req, res) => {};

module.exports = {
  getTotalIncome,
  getBranchesIncome,
  getBranchIncome,
};
