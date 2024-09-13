const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Competition = require("../../models/Competition");

// Get competitions with given query
router.get("/", async (req, res) => {
  let query = req.query;
  try {
    if (req.query.isPublic) {
      // Transform string into boolean
      let boolean = req.query.isPublic === "true" ? true : false;
      query = { ...query, isPublic: boolean };
    }
    // Fetch by competition._id, only find one competition
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      await Competition.findOne(query)
        .then((comps) => {
          res.status(200).send(comps);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // Otherwise return an array of all the competitions that match query
    else {
      await Competition.find(query)
        .then((comps) => {
          res.status(200).send(comps);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add Competition
router.post("/", async (req, res) => {
  try {
    if (!req.body.length) {
      res.status(400).send("No results in request");
      return;
    }
    if (req.body.length === 1) {
      let newComp = new Competition(req.body[0]);
      await newComp.save().catch((err) => {
        console.log(err);
      });
    } else {
      await Competition.insertMany(req.body);
    }

    res.status(201).json({
      success: true,
      msg: "Competitions saved",
    });
    res.status(201).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update one competition
router.put("/:id/update", async (req, res) => {
  try {
    await Competition.updateOne(
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
    await Competition.replaceOne(
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

// Delete Competition
router.delete("/:id", async (req, res) => {
  try {
    await Competition.deleteOne({
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
