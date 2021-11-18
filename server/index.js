"use strict";
const express = require("express");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Configure passport
app.use(passport.initialize());
require("./config/passport")(passport);

const competitions = require("./routes/api/competitions");
const feedback = require("./routes/api/feedback");
const users = require("./routes/api/users");
const cups = require("./routes/api/cups");

app.use("/api/competitions", competitions);
app.use("/api/feedback", feedback);
app.use("/api/users", users);
app.use("/api/cups", cups);

app.use(
  history({
    verbose: true,
  })
);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

let db = "";
if (process.env.NODE_ENV === "production") {
  db = process.env.mongodb_url;
} else {
  const config = require("./config/config.json");
  db = config.mongodb_url;
}

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`Database connected succesfully!`);
  })
  .catch((error) => {
    console.log(`Unable to connect with the database ${error}`);
  });

//Handle single page application
app.get(/.*/), (req, res) => res.sendFile(__dirname + "/public/index.html");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
);

module.exports = app;
