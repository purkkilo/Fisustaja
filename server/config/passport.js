const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const { ACCESS_COOKIE } = require("../utils/authCookies");

const key = process.env.SECRET;

const cookieExtractor = (req) => {
  if (req && req.cookies && req.cookies[ACCESS_COOKIE]) {
    return req.cookies[ACCESS_COOKIE];
  }
  return null;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: key,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload._id)
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => done(err, false));
    }),
  );
};
