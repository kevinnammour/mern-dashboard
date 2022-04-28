const router = require("express").Router();
const inquiriesController = require("../controllers/inquiriesController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");

router
  .route("/")
    .get(jwtValidator, rolesValidator("Admin"), inquiriesController.getUnsolvedInquiries)
  .post(inquiriesController.addInquiry)
  .put(jwtValidator, rolesValidator("Admin"), inquiriesController.solveInquiry);

module.exports = router;
