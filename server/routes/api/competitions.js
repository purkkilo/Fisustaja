const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const Competition = require("../../models/Competition");
const {
  requireAuth,
  requireAuthUnlessPublic,
} = require("../../middleware/auth");

// Get competitions with given query
router.get("/", requireAuthUnlessPublic, async (req, res) => {
  let query = req.query;
  try {
    if (req.query.isPublic) {
      let boolean = req.query.isPublic === "true";
      query = { ...query, isPublic: boolean };
    }
    if (req.query._id) {
      query = { _id: mongodb.ObjectId.createFromHexString(req.query._id) };
      if (req.query.isPublic === "true") {
        query.isPublic = true;
      }
      await Competition.findOne(query)
        .then((comps) => {
          res.status(200).send(comps);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    } else {
      await Competition.find(query)
        .then((comps) => {
          res.status(200).send(comps);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", requireAuth, async (req, res) => {
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
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id/update", requireAuth, async (req, res) => {
  try {
    await Competition.updateOne(
      { _id: mongodb.ObjectId.createFromHexString(req.params.id) },
      req.body,
    ).catch((err) => {
      console.log(err);
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/:id/replace", requireAuth, async (req, res) => {
  try {
    delete req.body._id;
    await Competition.replaceOne(
      { _id: mongodb.ObjectId.createFromHexString(req.params.id) },
      req.body,
    ).catch((err) => {
      console.log(err);
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put("/replace-many", requireAuth, async (req, res) => {
  try {
    const bulkData = req.body.map((item) => ({
      replaceOne: {
        upsert: true,
        filter: {
          _id: item._id,
        },
        replacement: item,
      },
    }));

    await Competition.bulkWrite(bulkData).catch((err) => {
      console.log(err);
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
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
