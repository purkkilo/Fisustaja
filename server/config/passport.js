const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
let key;

if (process.env.NODE_ENV === "production") {
  key = process.env.SECRET;
} else {
  const config = require("./config.json");
  key = config.secret;
}

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload._id)
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
};