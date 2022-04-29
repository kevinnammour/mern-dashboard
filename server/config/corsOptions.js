const whitelistedOrigins = require("../config/whitelistedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelistedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Domain not allowed"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;