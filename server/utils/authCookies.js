const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";
const MAX_SESSIONS = 20;

// Every token carries its type, so a refresh token can't be used as an
// access token (or the other way round), and a session id (`sid`) that must
// still be listed on the user. Logging out removes the session, which
// invalidates both tokens of that browser right away.
const ACCESS = "access";
const REFRESH = "refresh";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    is_admin: !!user.is_admin,
    createdAt: user.createdAt,
  };
}

function signAccess(user, sid) {
  return jwt.sign(
    {
      typ: ACCESS,
      sid,
      _id: user._id,
      name: user.name,
      email: user.email,
      is_admin: !!user.is_admin,
    },
    SECRET,
    { expiresIn: ACCESS_EXPIRES },
  );
}

function signRefresh(user, sid) {
  return jwt.sign({ typ: REFRESH, sid, _id: user._id }, SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
}

const newSessionId = () => crypto.randomBytes(16).toString("hex");

function hasSession(user, sid) {
  return (
    !!sid &&
    (user.sessions || []).some(
      (s) => s.sid === sid && new Date(s.expiresAt) > new Date(),
    )
  );
}

/** Start a new session for the user (login). Atomic updates, so parallel
 * logins and refreshes can't overwrite each other. */
async function startSession(user) {
  const User = require("../models/User");
  const sid = newSessionId();
  const now = new Date();
  await User.updateOne(
    { _id: user._id },
    { $pull: { sessions: { expiresAt: { $lte: now } } } },
  );
  await User.updateOne(
    { _id: user._id },
    {
      $push: {
        sessions: {
          $each: [
            { sid, expiresAt: new Date(now.getTime() + REFRESH_MAX_AGE_MS) },
          ],
          $slice: -MAX_SESSIONS,
        },
      },
    },
  );
  return sid;
}

/** Extend an existing session (refresh). The session id stays the same, so
 * two tabs refreshing at once don't invalidate each other. */
async function extendSession(user, sid) {
  const User = require("../models/User");
  const res = await User.updateOne(
    { _id: user._id, "sessions.sid": sid },
    {
      $set: {
        "sessions.$.expiresAt": new Date(Date.now() + REFRESH_MAX_AGE_MS),
      },
    },
  );
  return res.matchedCount > 0;
}

async function endSession(userId, sid) {
  const User = require("../models/User");
  await User.updateOne({ _id: userId }, { $pull: { sessions: { sid } } });
}

function setAuthCookies(res, user, sid) {
  res.cookie(
    ACCESS_COOKIE,
    signAccess(user, sid),
    cookieOptions(ACCESS_MAX_AGE_MS),
  );
  res.cookie(
    REFRESH_COOKIE,
    signRefresh(user, sid),
    cookieOptions(REFRESH_MAX_AGE_MS),
  );
}

function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, cookieOptions());
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
}

/** Payload of a valid token of the given type, or null. */
function verifyToken(token, type) {
  if (typeof token !== "string" || !token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    return payload.typ === type ? payload : null;
  } catch {
    return null;
  }
}

module.exports = {
  ACCESS,
  REFRESH,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  publicUser,
  hasSession,
  startSession,
  extendSession,
  endSession,
  setAuthCookies,
  clearAuthCookies,
  verifyToken,
};
