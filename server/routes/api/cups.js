const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get all cups
router.get("/", async (req, res) => {
  const cups = await loadCupsCollection();
  res.send(await cups.find({}).toArray());
});

// Get user's cups
router.get("/:user_id", async (req, res) => {
  const cups = await loadCupsCollection();
  res.send(await cups.find({ user_id: req.params.user_id }).toArray());
});

// Get certain cup
router.get("/cup/:cup_id", async (req, res) => {
  const cups = await loadCupsCollection();
  res.send(
    await cups.find({ _id: new mongodb.ObjectID(req.params.cup_id) }).toArray()
  );
});

// Add Cup
router.post("/", async (req, res) => {
  const cups = await loadCupsCollection();
  await cups.insertOne({
    user_id: req.body.user_id,
    name: req.body.name,
    year: req.body.year,
    signees: req.body.signees,
    isPublic: req.body.isPublic,
    createdAt: new Date(),
  });

  res.status(201).send();
});

// Update one competition
router.put("/:id", async (req, res) => {
  const cups = await loadCupsCollection();
  const cup = req.body;
  delete cup._id;
  await cups.replaceOne({ _id: new mongodb.ObjectID(req.params.id) }, cup);
  res.status(204).send();
});

// Delete Cup
router.delete("/:id", async (req, res) => {
  const cups = await loadCupsCollection();
  await cups.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

  res.status(200).send();
});

async function loadCupsCollection() {
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

  return client.db("fisustaja").collection("cups");
}

module.exports = router;
