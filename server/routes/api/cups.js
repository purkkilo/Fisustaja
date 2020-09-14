const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get all cups
router.get("/", async (req, res) => {
  const cups = await loadCupsCollection();
  if (cups) {
    let query = req.query;
    if (req.query.isPublic) {
      let boolean = req.query.isPublic === "true" ? true : false;
      query = { isPublic: boolean };
    }
    if (req.query._id) {
      query = { _id: new mongodb.ObjectID(req.query._id) };
    }
    try {
      let found_cups = await cups.find(query).toArray();
      res.status(200).send(found_cups);
    } catch (error) {
      res.status(400).send();
    }
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Add Cup
router.post("/", async (req, res) => {
  const cups = await loadCupsCollection();
  if (cups) {
    await cups.insertOne({
      user_id: req.body.user_id,
      name: req.body.name,
      year: req.body.year,
      signees: req.body.signees,
      isPublic: req.body.isPublic,
      createdAt: new Date(),
    });

    res.status(201).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Update one competition
router.put("/:id", async (req, res) => {
  const cups = await loadCupsCollection();

  if (cups) {
    const cup = req.body;
    delete cup._id;
    await cups.replaceOne({ _id: new mongodb.ObjectID(req.params.id) }, cup);
    res.status(204).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Delete Cup
router.delete("/:id", async (req, res) => {
  const cups = await loadCupsCollection();
  if (cups) {
    await cups.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

async function loadCupsCollection() {
  let mongodb_url = "";
  if (process.env.NODE_ENV === "production") {
    mongodb_url = process.env.MONGODB_URI;
  } else {
    const config = require("./config.json");
    mongodb_url = config.mongodb_url;
  }

  try {
    const client = await mongodb.MongoClient.connect(mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return client.db("fisustaja").collection("cups");
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = router;
