const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const history = require("connect-history-api-fallback");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Behind a reverse proxy (Heroku, Vercel, nginx) set TRUST_PROXY=1 so req.ip
// is the client's address; the login limiter counts attempts per IP.
if (process.env.TRUST_PROXY) {
  const hops = Number(process.env.TRUST_PROXY);
  app.set("trust proxy", Number.isNaN(hops) ? process.env.TRUST_PROXY : hops);
}

// The client is served from this same server (and the Vite dev server
// proxies /api), so cross-origin requests are only allowed for origins
// listed in CORS_ORIGINS (comma separated).
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
if (corsOrigins.length) {
  app.use(cors({ origin: corsOrigins, credentials: true }));
}

// Configure passport
app.use(passport.initialize());
require("./config/passport")(passport);

const competitions = require("./routes/api/competitions");
const users = require("./routes/api/users");
const cups = require("./routes/api/cups");
const results = require("./routes/api/results");
const fishes = require("./routes/api/fishes");

app.use("/api/competitions", competitions);
app.use("/api/users", users);
app.use("/api/cups", cups);
app.use("/api/results", results);
app.use("/api/fishes", fishes);
app.use(
  history({
    verbose: true,
  }),
);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// TODO local database
const url = process.env.MONGODB_URI;
const db = process.env.TESTING === "true" ? process.env.DEV_DB : process.env.DB;

mongoose.set("strictQuery", false);
mongoose
  .connect(url, { dbName: db })
  .then(() => {
    console.log(`Database connected succesfully!`);
  })
  .catch((error) => {
    console.log(`Unable to connect with the database ${error}`);
  });

// Errors passed to next(err): log them, answer without internals
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ success: false, msg: "Server error" });
});

// A rejected promise nobody awaited must not take the whole server down
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`),
);

module.exports = app;
