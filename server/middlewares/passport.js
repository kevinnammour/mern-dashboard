const Admin = require("../models/Admin");
const Partner = require("../models/Partner");
const { SECRET } = require("../config/env");
const { Strategy, ExtractJwt } = require("passport-jwt");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(options, async (payload, done) => {
      let CrmUser;
      if (payload.role === "Admin") {
        CrmUser = Admin;
      } else if (payload.role === "Partner") {
        CrmUser = Partner;
      } else {
        return done(null, false);
      }

      await CrmUser.findById(payload.userId)
      .then((crmUser) => {
        if (crmUser) {
          return done(null, crmUser);
        }
        return done(null, false);
      })
      .catch((err) => {
        return done(null, false);
      });
    })
  );
};