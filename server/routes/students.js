const router = require("express").Router();
const studentsController = require("../controllers/studentsController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");
const partnerAccessValidator = require("../middlewares/partnerAccessValidator");

router
  .route("/:branchId")
  .get(
    jwtValidator,
    rolesValidator("Admin", "Partner"),
    partnerAccessValidator("GET"),
    studentsController.getStudents
  );

router
  .route("/")
  .post(
    jwtValidator,
    rolesValidator("Admin", "Partner"),
    partnerAccessValidator("POST"),
    studentsController.addStudent
  );

router
  .route("/set-status")
  .put(
    jwtValidator,
    rolesValidator("Admin"),
    studentsController.updateStudentStatus
  );

router
  .route("/add-certificate")
  .post(
    jwtValidator,
    rolesValidator("Admin"),
    studentsController.addStudentCertificate
  );

module.exports = router;
