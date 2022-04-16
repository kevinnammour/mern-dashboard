const router = require("express").Router();

const { crmUserLogin, crmUserAuth, filterCrmUser } = require("../utils/Auth");

// CRM users Login Route

router.post("/login-crm-user", async (req, res) => {
  crmUserLogin(req.body, res);
});

router.get("/content", crmUserAuth, async(req, res) => {
    return res.json(filterCrmUser(req.user));
});

module.exports = router;