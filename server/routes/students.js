const router = require("express").Router();
const studentsController = require("../controllers/studentsController");
const rolesValidator = require("../middlewares/rolesValidator");

router
  .route("/:id")
  .get(rolesValidator("Admin"), studentsController.getRequestedStudents);

router
  .route("/")
  .get(rolesValidator("Partner"), studentsController.getBranchStudents)
  .post(studentsController.addStudent);

router
  .route("/set-status")
  .put(rolesValidator("Admin"), studentsController.updateStudentStatus);

router
  .route("/add-certificate")
  .post(rolesValidator("Admin"), studentsController.addStudentCertificate);

module.exports = router;