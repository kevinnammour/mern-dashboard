const router = require("express").Router();
const studentsController = require("../controllers/studentsController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");

router
  .route("/:id")
  .get(jwtValidator, rolesValidator("Admin"), studentsController.getRequestedStudents);

router
  .route("/")
  .get(jwtValidator, rolesValidator("Partner"), studentsController.getBranchStudents)
  .post(jwtValidator, studentsController.addStudent);

router
  .route("/set-status")
  .put(jwtValidator, rolesValidator("Admin"), studentsController.updateStudentStatus);

router
  .route("/add-certificate")
  .post(jwtValidator, rolesValidator("Admin"), studentsController.addStudentCertificate);

module.exports = router;