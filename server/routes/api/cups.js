const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Cup = require("../../models/Cup");

// Get all cups
router.get("/", async (req, res) => {
  let query = req.query;
  try {
    if (req.query.isPublic) {
      // Transform string into boolean
      let boolean = req.query.isPublic === "true" ? true : false;
      query = { ...query, isPublic: boolean };
    }
    // Fetch by _id
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      await Cup.findOne(query)
        .then((cups) => {
          res.status(200).send(cups);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // Otherwise return an array of all the competitions that match query
    else {
      await Cup.find(query)
        .then((cups) => {
          res.status(200).send(cups);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add Cup
router.post("/", async (req, res) => {
  try {
    if (!req.body.length) {
      res.status(400).send("No results in request");
      return;
    }
    if (req.body.length === 1) {
      let newCup = new Cup(req.body[0]);
      await newCup.save().catch((err) => {
        console.log(err);
      });
    } else {
      await Cup.insertMany(req.body).catch((err) => {
        console.log(err);
      });
    }

    res.status(201).json({
      success: true,
      msg: "Cups saved",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update one competition
router.put("/:id/update", async (req, res) => {
  try {
    await Cup.updateOne(
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

// Replace one competition
router.put("/:id/replace", async (req, res) => {
  try {
    delete req.body._id;
    await Cup.replaceOne(
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

// Delete Cup
router.delete("/:id", async (req, res) => {
  try {
    await Cup.deleteOne({
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
