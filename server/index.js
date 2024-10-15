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
const results = require("./routes/api/results");
const fishes = require("./routes/api/fishes");

app.use("/api/competitions", competitions);
app.use("/api/feedback", feedback);
app.use("/api/users", users);
app.use("/api/cups", cups);
app.use("/api/results", results);
app.use("/api/fishes", fishes);
app.use(
  history({
    verbose: true,
  })
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

//Handle single page application
app.get(/.*/), (req, res) => res.sendFile(__dirname + "/public/index.html");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
);

module.exports = app;
