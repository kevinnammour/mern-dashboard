const router = require("express").Router();
const studentsController = require("../controllers/studentsController");
const rolesValidator = require("../middlewares/rolesValidator");

router
  .route("/:id")
  .get(rolesValidator("Admin"), studentsController.getRequestedStudents);

router
  .route("/")
  .get(rolesValidator("Partner"), studentsController.getBranchStudents())
  .post(studentsController.addStudent);

module.exports = router;
