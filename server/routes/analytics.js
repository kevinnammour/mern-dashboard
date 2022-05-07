const router = require("express").Router();
const analyticsController = require("../controllers/analyticsController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");

router
  .route("/total-income")
  .get(
    jwtValidator,
    rolesValidator("Admin"),
    analyticsController.getTotalIncome
  );

router
  .route("/branches-income")
  .get(
    jwtValidator,
    rolesValidator("Admin"),
    analyticsController.getBranchesIncome
  );

router
  .route("/attending-students")
  .get(
    jwtValidator,
    rolesValidator("Admin"),
    analyticsController.getHighestAttendingStudents
  );

router
  .route("/branch-income/:branchId")
  .get(
    jwtValidator,
    rolesValidator("Admin"),
    analyticsController.getBranchIncome
  );

module.exports = router;