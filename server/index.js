"use strict";
const express = require("express");
const cors = require("cors");
const path = require("path");
const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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
// Handle production
if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public"));

  //Handle single page application
  app.get(/.*/), (req, res) => res.sendFile(__dirname + "/public/index.html");
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

module.exports = app;
