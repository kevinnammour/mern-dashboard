const router = require("express").Router();
const invoicesController = require("../controllers/invoicesController");
const rolesValidator = require("../middlewares/rolesValidator");
const jwtValidator = require("../middlewares/jwtValidator");
const partnerAccessValidator = require("../middlewares/partnerAccessValidator");

router
  .route("/:branchId")
  .get(
    jwtValidator,
    rolesValidator("Admin", "Partner"),
    partnerAccessValidator("GET"),
    invoicesController.getInvoices
  );

router
  .route("/")
  .post(
    jwtValidator,
    rolesValidator("Partner"),
    partnerAccessValidator("POST"),
    invoicesController.addInvoice
  )
  .put(jwtValidator, rolesValidator("Admin"), invoicesController.updateLbpRate);

module.exports = router;
