const express = require("express");
const mongodb = require("mongodb");
const { pickQuery, parseObjectId, parseBoolean } = require("../../utils/query");
const router = express.Router();
const Competition = require("../../models/Competition");
const {
  requireAuth,
  requireAuthUnlessPublic,
} = require("../../middleware/auth");

// Query fields the client may filter by
const FIELDS = ["cup_id", "user_id", "state"];

router.get("/", requireAuthUnlessPublic, async (req, res, next) => {
  try {
    const isPublic = parseBoolean(req.query.isPublic);
    const visibility = isPublic === undefined ? {} : { isPublic };
    if (req.query._id !== undefined) {
      const id = parseObjectId(req.query._id);
      if (!id) return res.status(400).json({ msg: "Invalid id" });
      return res
        .status(200)
        .send(await Competition.findOne({ _id: id, ...visibility }));
    }
    const filter = { ...pickQuery(req.query, FIELDS), ...visibility };
    return res.status(200).send(await Competition.find(filter));
  } catch (err) {
    return next(err);
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
