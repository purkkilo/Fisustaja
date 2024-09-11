const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Fish = require("../../models/Fish");

// Get fishes with given query
router.get("/", async (req, res) => {
  let query = req.query;
  try {
    // Fetch by fish._id, only find one
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      res.status(200).send(await Fish.findOne(query));
    }
    // Otherwise return an array of all the fishes that match query
    else {
      res.status(200).send(await Fish.find(query));
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
      let newResult = new Fish(req.body[0]);
      await newResult.save();
    } else {
      await Fish.insertMany(req.body);
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
    );
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
    );
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
    });
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
