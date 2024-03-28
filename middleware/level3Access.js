module.exports = function (req, res, next) {
    if (
      !(req.user.isIntakeCoordinator ||
      req.user.isCenterCoordinator ||
      req.user.isAdmin)
    ) {
      return res.status(403).send("Access denied!");
    }
    next();
  };
  