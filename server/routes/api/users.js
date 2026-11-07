const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const { requireAuth, requireAdmin } = require("../../middleware/auth");
const {
  publicUser,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
  REFRESH_COOKIE,
} = require("../../utils/authCookies");

/**
 * @route POST api/users/register
 * @desc Register a user (admin only)
 */
router.post("/register", requireAdmin, (req, res) => {
  let { name, email, password, is_admin } = req.body;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.status(409).json({
        msg: "Email is already in use!",
      });
      return;
    }

    User.findOne({ name: name }).then((existing) => {
      if (existing) {
        res.status(409).json({
          msg: "Username is already taken!",
        });
        return;
      }

      let newUser = new User({
        name,
        email,
        password,
        is_admin,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          newUser.password = hash;
          newUser.save().then(() => {
            res.status(201).json({
              success: true,
              msg: "User is now registered.",
            });
          });
        });
      });
    });
  });
});

/**
 * @route POST api/users/login
 * @desc Login; sets HttpOnly access + refresh cookies
 */
router.post("/login", (req, res) => {
  User.findOne({ name: req.body.name }).then((user) => {
    if (!user) {
      res.status(404).json({
        msg: "Username not found",
        success: false,
      });
      return;
    }

    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (!isMatch) {
        res.status(401).json({
          msg: "Incorrect password",
          success: false,
        });
        return;
      }

      setAuthCookies(res, user);
      res.status(200).json({
        success: true,
        user: publicUser(user),
        msg: "You are now logged in!",
      });
    });
  });
});

/**
 * @route POST api/users/logout
 * @desc Clear auth cookies
 */
router.post("/logout", (req, res) => {
  clearAuthCookies(res);
  res.status(200).json({ success: true, msg: "Logged out" });
});

/**
 * @route GET api/users/me
 * @desc Current user from access cookie
 */
router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: publicUser(req.user),
  });
});

/**
 * @route POST api/users/refresh
 * @desc Rotate access cookie using refresh cookie; is_admin always from DB
 */
router.post("/refresh", async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    clearAuthCookies(res);
    return res.status(401).json({
      error: "Unauthorized access",
      success: false,
    });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload._id);
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        error: "Unauthorized access",
        success: false,
      });
    }

    setAuthCookies(res, user);
    return res.status(200).json({
      success: true,
      user: publicUser(user),
      msg: "Token refreshed!",
    });
  } catch (err) {
    clearAuthCookies(res);
    return res.status(401).json({
      error: "Unauthorized access",
      success: false,
    });
  }
});

/**
 * @route GET api/users/
 * @desc List users (admin only)
 */
router.get("/", requireAdmin, (req, res) => {
  User.find({})
    .then((users) => {
      res.json({
        users: users.map(publicUser),
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
