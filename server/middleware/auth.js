const passport = require("passport");

function authenticate(req, res, next, onResult) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    onResult(user || null);
  })(req, res, next);
}

function requireAuth(req, res, next) {
  authenticate(req, res, next, (user) => {
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized access", success: false });
    }
    req.user = user;
    return next();
  });
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user?.is_admin) {
      return res
        .status(403)
        .json({ error: "Admin access required", success: false });
    }
    return next();
  });
}

/** Sets req.user when a valid session exists; never rejects. */
function optionalAuth(req, res, next) {
  authenticate(req, res, next, (user) => {
    if (user) req.user = user;
    return next();
  });
}

/** Auth required unless the request is explicitly for public data. */
function requireAuthUnlessPublic(req, res, next) {
  if (req.query.isPublic === "true") return optionalAuth(req, res, next);
  return requireAuth(req, res, next);
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
  requireAuthUnlessPublic,
};
