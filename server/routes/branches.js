const router = require("express").Router();
const branchesController = require("../controllers/branchesController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");

router
  .route("/:id")
  .get(jwtValidator, rolesValidator("Admin"), branchesController.getBranch);

router
  .route("/")
  .post(jwtValidator, rolesValidator("Admin"), branchesController.addBranch)
  .put(
    jwtValidator,
    rolesValidator("Admin"),
    branchesController.updateBranchStatus
  );

module.exports = router;