const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
let key;
const User = require("../../models/User");

if (process.env.NODE_ENV === "production") {
  key = process.env.SECRET;
} else {
  const config = require("../../config/config.json");
  key = config.secret;
}

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post("/register", (req, res) => {
  let { name, email, password, is_admin } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      console.log("Email is already in use!");
      res.status(409).json({
        msg: "Email is already in use!",
      });
      return;
    } else {
      // Check name and email for duplicates
      User.findOne({ name: name }).then((user) => {
        if (user) {
          console.log("Username is already taken!");
          res.status(409).json({
            msg: "Username is already taken!",
          });
          return;
        } else {
          // User is valid
          let newUser = new User({
            name,
            email,
            password,
            is_admin,
          });

          // Hash the password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
              }
              newUser.password = hash;
              newUser.save().then((user) => {
                res.status(201).json({
                  success: true,
                  msg: "User is now registered.",
                });
                return;
              });
            });
          });
        }
      });
    }
  });
});

/**
 * @route POST api/users/login
 * @desc Login the User
 * @access Public
 */
router.post("/login", (req, res) => {
  User.findOne({ name: req.body.name }).then((user) => {
    if (!user) {
      res.status(404).json({
        msg: "Username not found",
        success: false,
      });
      return;
    } else {
      // If there is user, compare the password
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          // Password correct! send back JSON Token back
          const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
          };
          // token expires in a week
          jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
            console.log(err);
            console.log(token);
            res.status(200).json({
              success: true,
              token: `Bearer ${token}`,
              user: user,
              msg: "You are now logged in!",
            });
          });
        } else {
          res.status(404).json({
            msg: "Incorrect password",
            success: false,
          });
          return;
        }
      });
    }
  });
});

/**
 * @route POST api/users/profile
 * @desc Return the User's data
 * @access Private
 */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

/**
 * @route POST api/users/
 * @desc Return users
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.is_admin) {
      User.find({}).then((users) => {
        return res.json({
          users: users,
        });
      });
    } else {
      console.log("Unauthorized access");
      res.status(401).json({
        msg: "Unauthorized access",
        success: false,
      });
      return;
    }
  }
);

module.exports = router;
