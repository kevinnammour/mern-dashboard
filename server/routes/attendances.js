const router = require("express").Router();
const attendancesController = require("../controllers/attendancesController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");
const partnerAccessValidator = require("../middlewares/partnerAccessValidator");

router
  .route("/:branchId")
  .get(
    jwtValidator,
    rolesValidator("Admin", "Partner"),
    partnerAccessValidator("GET"),
    attendancesController.getAttendanceSheets
  );

router
  .route("/")
  .post(
    jwtValidator,
    rolesValidator("Partner"),
    partnerAccessValidator("POST"),
    attendancesController.addAttendanceSheet
  );

module.exports = router;