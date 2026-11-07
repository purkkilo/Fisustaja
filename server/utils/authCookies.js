const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const ACCESS_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
    maxAge,
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

function signAccess(user) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      is_admin: !!user.is_admin,
    },
    SECRET,
    { expiresIn: ACCESS_EXPIRES },
  );
}

function signRefresh(user) {
  return jwt.sign({ _id: user._id }, SECRET, { expiresIn: REFRESH_EXPIRES });
}

function setAuthCookies(res, user) {
  res.cookie(ACCESS_COOKIE, signAccess(user), cookieOptions(ACCESS_MAX_AGE_MS));
  res.cookie(
    REFRESH_COOKIE,
    signRefresh(user),
    cookieOptions(REFRESH_MAX_AGE_MS),
  );
}

function clearAuthCookies(res) {
  const base = {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/",
  };
  res.clearCookie(ACCESS_COOKIE, base);
  res.clearCookie(REFRESH_COOKIE, base);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  publicUser,
  signAccess,
  signRefresh,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
};
