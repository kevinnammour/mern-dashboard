const router = require("express").Router();
const branchesController = require("../controllers/branchesController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");

router
  .route("/")
  .get(jwtValidator, rolesValidator("Admin"), branchesController.getBranches)
  .post(jwtValidator, rolesValidator("Admin"), branchesController.addBranch)
  .put(
    jwtValidator,
    rolesValidator("Admin"),
    branchesController.updateBranchStatus
  );

module.exports = router;