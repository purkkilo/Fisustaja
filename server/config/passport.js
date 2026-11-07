const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const { ACCESS, ACCESS_COOKIE, hasSession } = require("../utils/authCookies");

const cookieExtractor = (req) => req?.cookies?.[ACCESS_COOKIE] || null;

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      // Only access tokens of a session that hasn't been logged out
      if (payload.typ !== ACCESS) return done(null, false);
      try {
        const user = await User.findById(payload._id);
        if (!user || !hasSession(user, payload.sid)) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }),
  );
};
