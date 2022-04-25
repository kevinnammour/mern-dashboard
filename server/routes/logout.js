const router = require("express").Router();
const handleLogout = require('../controllers/logoutController');

router.post("/logout", handleLogout);

module.exports = router;