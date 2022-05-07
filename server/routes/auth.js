const router = require("express").Router();
const loginController = require('../controllers/loginController');
const logoutController = require('../controllers/logoutController');
const rfshTokenController = require('../controllers/rfshTokenController');
const resetPassController = require('../controllers/resetPassController');

router.post("/login", loginController.handleLogin);
router.get("/logout", logoutController.handleLogout);
router.get("/refresh", rfshTokenController.handleRefreshToken);
router.put("/reset-pass", resetPassController.handleResetPassword);

module.exports = router;