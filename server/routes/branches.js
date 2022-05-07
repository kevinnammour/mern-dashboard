const router = require("express").Router();
const branchesController = require("../controllers/branchesController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");

router
  .route("/")
  .post(jwtValidator, rolesValidator("Admin"), branchesController.addBranch)
  .put(
    jwtValidator,
    rolesValidator("Admin"),
    branchesController.updateBranchStatus
  );

router.get(
  "/names",
  jwtValidator,
  rolesValidator("Admin"),
  branchesController.getBranchNames
);

router.get("/locations", branchesController.getBranchLocations);

router.get(
  "/:branchId",
  jwtValidator,
  rolesValidator("Admin"),
  branchesController.getBranch
);

module.exports = router;
