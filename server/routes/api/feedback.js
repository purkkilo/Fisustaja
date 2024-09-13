const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Feedback = require("../../models/Feedback");

// Get Feedback
router.get("/", async (req, res) => {
  let query = req.query;
  try {
    // Fetch by _id
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      let l = await Feedback.findOne(query)
        .then((feedback) => {
          res.status(200).send(feedback);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(l);
    }
    // Otherwise return an array of all the competitions that match query
    else {
      await Feedback.find(query)
        .then((feedback) => {
          res.status(200).send(feedback);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add Feedback
router.post("/", async (req, res) => {
  try {
    if (!req.body.length) {
      res.status(400).send("No results in request");
      return;
    }

    if (req.body.length === 1) {
      let newFeedback = new Feedback(req.body[0]);
      await newFeedback.save().catch((err) => {
        console.log(err);
      });
    } else {
      await Feedback.insertMany(req.body).catch((err) => {
        console.log(err);
      });
    }

    res.status(201).json({
      success: true,
      msg: "Feedbacks saved",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Feedback
router.delete("/:id", async (req, res) => {
  try {
    await Feedback.deleteOne({
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
