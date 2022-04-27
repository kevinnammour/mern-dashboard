const router = require("express").Router();
const branchesController = require("../controllers/branchesController");
const rolesValidator = require("../middlewares/rolesValidator");

router.route("/:id").get(rolesValidator("Admin"), branchesController.getBranch);

router
  .route("/")
  .post(rolesValidator("Admin"), branchesController.addBranch)
  .put(rolesValidator("Admin"), branchesController.updateBranchStatus);

module.exports = router;
