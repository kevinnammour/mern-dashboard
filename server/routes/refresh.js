const router = require("express").Router();
const handleRefreshToken = require('../controllers/rfshTokenController');

router.get("/refresh", handleRefreshToken);

module.exports = router;