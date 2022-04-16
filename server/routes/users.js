const router = require("express").Router();

const { crmUserLogin, crmUserAuth, filterCrmUser, checkCrmUserRole } = require("../utils/Auth");

// CRM users Login Route

router.post("/login-crm-user", async (req, res) => {
  crmUserLogin(req.body, res);
});

router.get("/both", crmUserAuth, async(req, res) => {
    return res.json(filterCrmUser(req.user));
});

router.get("/admin", crmUserAuth, checkCrmUserRole("Admin"), async(req, res) => {
    return res.json("Hello Admin");
});

router.get("/partner", crmUserAuth, checkCrmUserRole("Partner"), async(req, res) => {
    return res.json("Hello Partner");
});

module.exports = router;