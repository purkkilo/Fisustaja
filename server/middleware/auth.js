const passport = require("passport");

function requireAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized access", success: false });
    }
    req.user = user;
    return next();
  })(req, res, next);
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user?.is_admin) {
      return res.status(403).json({ error: "Admin access required", success: false });
    }
    return next();
  });
}

/** Auth required unless the request is explicitly for public data. */
function requireAuthUnlessPublic(req, res, next) {
  if (req.query.isPublic === "true") {
    return next();
  }
  return requireAuth(req, res, next);
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireAuthUnlessPublic,
};
