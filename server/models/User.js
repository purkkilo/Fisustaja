const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Logged-in browsers; removed on logout (see utils/authCookies.js)
  sessions: {
    type: [
      {
        _id: false,
        sid: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
    default: [],
  },
});

module.exports = User = mongoose.model("users", UserSchema);
