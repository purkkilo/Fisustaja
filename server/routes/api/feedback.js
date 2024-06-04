const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Feedback
router.get("/", async (req, res) => {
  const feedback = await loadFeedbackCollection();

  if (feedback) {
    let query = req.query;
    res.send(await feedback.find(query).toArray());
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Add Competition
router.post("/", async (req, res) => {
  const feedback = await loadFeedbackCollection();

  if (feedback) {
    await feedback.insertOne({
      type: req.body.type,
      message: req.body.message,
      createdAt: new Date(),
    });

    res.status(201).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Delete Competitions
router.delete("/:id", async (req, res) => {
  const feedback = await loadFeedbackCollection();

  if (feedback) {
    await feedback.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

async function loadFeedbackCollection() {
  let mongodb_url = "";
  if (process.env.NODE_ENV === "production") {
    mongodb_url = process.env.MONGODB_URI;
  } else {
    const config = require("../../config/config.json");
    mongodb_url = config.mongodb_url;
  }

  try {
    const client = await mongodb.MongoClient.connect(mongodb_url);

    return client.db("fisustaja").collection("feedback");
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = router;
