const router = require("express").Router();
const handleLogin = require('../controllers/loginController');

router.post("/login", handleLogin);

module.exports = router;