const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Competitions
router.get("/", async (req, res) => {
  const feedback = await loadFeedbackCollection();
  res.send(await feedback.find({}).toArray());
});

// Add Competition
router.post("/", async (req, res) => {
  const feedback = await loadFeedbackCollection();
  await feedback.insertOne({
    type: req.body.type,
    message: req.body.message,
    createdAt: new Date(),
  });

  res.status(201).send();
});

// Delete Competitions
router.delete("/:id", async (req, res) => {
  const feedback = await loadFeedbackCollection();
  await feedback.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

  res.status(200).send();
});

async function loadFeedbackCollection() {
  let mongodb_url = "";
  if (process.env.NODE_ENV === "production") {
    mongodb_url = process.env.MONGODB_URI;
  } else {
    const config = require("./config.json");
    mongodb_url = config.mongodb_url;
  }

  const client = await mongodb.MongoClient.connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client.db("fisustaja").collection("feedback");
}

module.exports = router;
