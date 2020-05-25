const express = require("express");
const cors = require("cors");
var path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const competitions = require("./routes/api/competitions");

app.use("/api/competitions", competitions);

// Handle production
if (process.env.NODE_ENV === "production") {
  // Static folder
  app.use(express.static(__dirname + "/public"));

  //Handle single page application
  console.log("Production!");
  app.get(/.*/), (req, res) => res.sendFile(__dirname + '/public/index.html');
}

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

module.exports = app;
