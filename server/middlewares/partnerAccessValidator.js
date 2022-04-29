const partnerAccessValidator = (type) => {
  return (req, res, next) => {
    if (!req?.role || !req?.userId) return res.sendStatus(401);
    if (req.role === "Partner") {
      const branchId = type === "GET" ? req.params.branchId : req.body.branchId;
      if (branchId === undefined)
        return res.status(400).json({ message: "Branch id required." });
      if (branchId !== req.userId) return res.sendStatus(401);
    }
    next();
  };
};

module.exports = partnerAccessValidator;
