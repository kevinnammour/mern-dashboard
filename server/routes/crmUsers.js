const router = require("express").Router();

router.get("/admin", (req, res) => {
  return res.json("Hello admin");
});

router.get("/partner", (req, res) => {
  return res.json("Hello partner");
});

module.exports = router;