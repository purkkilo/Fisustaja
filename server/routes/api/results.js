const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Result = require("../../models/Result");

// Get results with given query
router.get("/", async (req, res) => {
  let query = req.query;
  try {
    // Fetch by _id
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      await Result.findOne(query)
        .then((results) => {
          res.status(200).send(results);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // Otherwise return an array of all the competitions that match query
    else {
      await Result.find(query)
        .then((results) => {
          res.status(200).send(results);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add results
router.post("/", async (req, res) => {
  try {
    if (!req.body.length) {
      res.status(400).send("No results in request");
      return;
    }

    if (req.body.length === 1) {
      let newResult = new Result(req.body[0]);
      await newResult.save().catch((err) => {
        console.log(err);
      });
    } else {
      await Result.insertMany(req.body).catch((err) => {
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

// Update one result
router.put("/:id/update", async (req, res) => {
  try {
    await Result.updateOne(
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

// Replace one result
router.put("/:id/replace", async (req, res) => {
  try {
    await Result.replaceOne(
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

// Delete results
router.delete("/:id", async (req, res) => {
  try {
    await Result.deleteOne({
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
