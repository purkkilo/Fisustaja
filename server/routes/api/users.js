const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { requireAuth, requireAdmin } = require("../../middleware/auth");
const loginLimiter = require("../../utils/loginLimiter");
const {
  ACCESS,
  ACCESS_COOKIE,
  REFRESH,
  REFRESH_COOKIE,
  publicUser,
  hasSession,
  startSession,
  extendSession,
  endSession,
  setAuthCookies,
  clearAuthCookies,
  verifyToken,
} = require("../../utils/authCookies");

const MAX_FIELD_LENGTH = 200;

/** Trimmed string, or null when missing, not a string or too long. */
function text(value, { trim = true } = {}) {
  if (typeof value !== "string") return null;
  const result = trim ? value.trim() : value;
  return result && result.length <= MAX_FIELD_LENGTH ? result : null;
}

const unauthorized = (res) =>
  res.status(401).json({ error: "Unauthorized access", success: false });

/**
 * @route POST api/users/register
 * @desc Register a user (admin only)
 */
router.post("/register", requireAdmin, async (req, res, next) => {
  try {
    const name = text(req.body?.name);
    const email = text(req.body?.email);
    const password = text(req.body?.password, { trim: false });
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Name, email and password are required" });
    }

    if (await User.exists({ email })) {
      return res.status(409).json({ msg: "Email is already in use!" });
    }
    if (await User.exists({ name })) {
      return res.status(409).json({ msg: "Username is already taken!" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
      is_admin: req.body.is_admin === true || req.body.is_admin === "true",
    });
    return res
      .status(201)
      .json({ success: true, msg: "User is now registered." });
  } catch (err) {
    return next(err);
  }
});

/**
 * @route POST api/users/login
 * @desc Login; sets HttpOnly access + refresh cookies
 */
router.post("/login", async (req, res, next) => {
  try {
    const name = text(req.body?.name);
    const password = text(req.body?.password, { trim: false });
    if (!name || !password) {
      return res
        .status(400)
        .json({ msg: "Username and password are required", success: false });
    }

    const wait = loginLimiter.retryAfter(req, name);
    if (wait) {
      res.set("Retry-After", String(wait));
      return res
        .status(429)
        .json({ msg: "Too many login attempts", success: false });
    }

    const user = await User.findOne({ name });
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isMatch) {
      loginLimiter.recordFailure(req, name);
      // Same answer for unknown user and wrong password
      return res
        .status(401)
        .json({ msg: "Incorrect username or password", success: false });
    }

    loginLimiter.reset(req, name);
    const sid = await startSession(user);
    setAuthCookies(res, user, sid);
    return res.status(200).json({
      success: true,
      user: publicUser(user),
      msg: "You are now logged in!",
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * @route POST api/users/logout
 * @desc End this browser's session and clear the cookies
 */
router.post("/logout", async (req, res, next) => {
  try {
    const payload =
      verifyToken(req.cookies?.[REFRESH_COOKIE], REFRESH) ||
      verifyToken(req.cookies?.[ACCESS_COOKIE], ACCESS);
    if (payload?.sid) await endSession(payload._id, payload.sid);
    clearAuthCookies(res);
    return res.status(200).json({ success: true, msg: "Logged out" });
  } catch (err) {
    clearAuthCookies(res);
    return next(err);
  }
});

/**
 * @route GET api/users/me
 * @desc Current user from access cookie
 */
router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

/**
 * @route POST api/users/refresh
 * @desc New cookies from a valid refresh cookie; is_admin always from DB
 */
router.post("/refresh", async (req, res, next) => {
  try {
    const payload = verifyToken(req.cookies?.[REFRESH_COOKIE], REFRESH);
    const user = payload && (await User.findById(payload._id));
    if (
      !user ||
      !hasSession(user, payload.sid) ||
      !(await extendSession(user, payload.sid))
    ) {
      clearAuthCookies(res);
      return unauthorized(res);
    }

    setAuthCookies(res, user, payload.sid);
    return res.status(200).json({
      success: true,
      user: publicUser(user),
      msg: "Token refreshed!",
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * @route GET api/users/
 * @desc List users (admin only)
 */
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json({ users: users.map(publicUser) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
