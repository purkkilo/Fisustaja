const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();

// Get all cups
router.get("/", async (req, res) => {
  const cups = await loadCupsCollection();
  if (cups) {
    let query = req.query;
    try {
      if (req.query.isPublic) {
        // Transform string into boolean
        let boolean = req.query.isPublic === "true" ? true : false;
        query = { isPublic: boolean };
      }
      // Fetch by cup._id, only find one cup
      if (req.query._id) {
        query = { _id: new mongodb.ObjectId(req.query._id) };
        res.status(200).send(await cups.findOne(query));
      }
      // Otherwise return an array of all the cups that match query
      else {
        res.status(200).send(await cups.find(query).toArray());
      }
    } catch (error) {
      res.status(400).send(error);
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
      meaningful_competitions: req.body.meaningful_competitions,
    });

    res.status(201).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Update one competition
router.put("/:id/update", async (req, res) => {
  const cups = await loadCupsCollection();
  if (cups) {
    const newvalues = req.body;
    await cups.updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      newvalues
    );
    res.status(204).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Replace one competition
router.put("/:id/replace", async (req, res) => {
  const cups = await loadCupsCollection();
  if (cups) {
    const cup = req.body;
    delete cup._id;
    await cups.replaceOne({ _id: new mongodb.ObjectId(req.params.id) }, cup);
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
    await cups.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

async function loadCupsCollection() {
  let mongodb_url = "";
  let db = "fisustaja";

  if (process.env.NODE_ENV === "production") {
    mongodb_url = process.env.MONGODB_URI;
  } else {
    const config = require("../../config/config.json");
    mongodb_url = config.mongodb_url;
    if (config.use_dev_db) {
      db = "fisustaja-dev";
    }
  }

  try {
    const client = await mongodb.MongoClient.connect(mongodb_url);

    return client.db(db).collection("cups");
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = router;
