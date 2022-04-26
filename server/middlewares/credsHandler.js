const whitelistedOrigins = require("../config/whitelistedOrigins");

const credsHandler = (req, res, next) => {
  const origin = req.headers.origin;
  if (whitelistedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credsHandler;
