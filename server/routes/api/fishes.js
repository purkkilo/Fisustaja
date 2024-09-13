const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Fish = require("../../models/Fish");

// Get fishes with given query
router.get("/", async (req, res) => {
  let query = req.query;
  try {
    // Fetch by _id
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      await Fish.findOne(query)
        .then((fish) => {
          res.status(200).send(fish);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // Otherwise return an array of all the competitions that match query
    else {
      await Fish.find(query)
        .then((fish) => {
          res.status(200).send(fish);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add fishes
router.post("/", async (req, res) => {
  try {
    if (!req.body.length) {
      res.status(400).send("No fishes in request");
      return;
    }

    if (req.body.length === 1) {
      let newFish = new Fish(req.body[0]);
      await newFish.save().catch((err) => {
        console.log(err);
      });
    } else {
      await Fish.insertMany(req.body).catch((err) => {
        console.log(err);
      });
    }

    res.status(201).json({
      success: true,
      msg: "Results saved",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update one fish
router.put("/:id/update", async (req, res) => {
  try {
    await Fish.updateOne(
      { _id: mongodb.ObjectId.createFromHexString(req.params.id) },
      req.body
    ).catch((err) => {
      console.log(err);
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

// Replace one fish
router.put("/:id/replace", async (req, res) => {
  try {
    await Fish.replaceOne(
      { _id: mongodb.ObjectId.createFromHexString(req.params.id) },
      req.body
    ).catch((err) => {
      console.log(err);
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete fishes
router.delete("/:id", async (req, res) => {
  try {
    await Fish.deleteOne({
      _id: mongodb.ObjectId.createFromHexString(req.params.id),
    }).catch((err) => {
      console.log(err);
    });
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
