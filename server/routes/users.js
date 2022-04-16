const router = require("express").Router();

const { crmUserLogin } = require('../utils/Auth');

// CRM users Login Route

router.post("/login-crm-user", async (req, res) => {
    crmUserLogin(req.body, res);
});

module.exports = router;