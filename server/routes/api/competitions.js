const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();

// Get all competitions
router.get("/", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    res.send(await competitions.find({}).toArray());
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Get user's competitions
router.get("/:user_id", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    res.send(
      await competitions.find({ user_id: req.params.user_id }).toArray()
    );
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Get cup's competitions
router.get("/cup/:cup_id", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    res.send(await competitions.find({ cup_id: req.params.cup_id }).toArray());
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Get certain competition
router.get("/competition/:competition_id", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    try {
      res.send(
        await competitions
          .find({ _id: new mongodb.ObjectID(req.params.competition_id) })
          .toArray()
      );
    } catch (err) {
      console.log(err.message);
    }
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Get public competitions
router.get("/public", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    res.send(await competitions.find({}).toArray());
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Add Competition
router.post("/", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    await competitions.insertOne({
      user_id: req.body.user_id,
      cup_id: req.body.cup_id,
      name: req.body.name,
      locality: req.body.locality,
      cup_name: req.body.cup_name,
      cup_placement_points: req.body.cup_placement_points,
      cup_placement_points_array: req.body.cup_placement_points_array,
      cup_participation_points: req.body.cup_participation_points,
      cup_points_multiplier: req.body.cup_points_multiplier,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      total_weights: req.body.total_weights,
      fishes: req.body.fishes,
      state: req.body.state,
      signees: req.body.signees,
      teams: req.body.teams,
      normal_points: req.body.normal_points,
      normal_weights: req.body.normal_weights,
      team_results: req.body.team_results,
      team_competition: req.body.team_competition,
      biggest_fishes: req.body.biggest_fishes,
      biggest_amounts: req.body.biggest_amounts,
      isPublic: req.body.isPublic,
      isFinished: req.body.isFinished,
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
  const competitions = await loadCompetitionsCollection();

  if (competitions) {
    const competition = req.body;
    delete competition._id;
    await competitions.replaceOne(
      { _id: new mongodb.ObjectID(req.params.id) },
      competition
    );
    res.status(204).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

// Delete Competitions
router.delete("/:id", async (req, res) => {
  const competitions = await loadCompetitionsCollection();
  if (competitions) {
    await competitions.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
  } else {
    // Connection timed out
    res.status(408).send();
  }
});

async function loadCompetitionsCollection() {
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

    return client.db("fisustaja").collection("competitions");
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
