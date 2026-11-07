const express = require("express");
const mongodb = require("mongodb");
const { pickQuery, parseObjectId, parseBoolean } = require("../../utils/query");
const router = express.Router();
const Cup = require("../../models/Cup");
const {
  requireAuth,
  requireAuthUnlessPublic,
} = require("../../middleware/auth");

// Query fields the client may filter by
const FIELDS = ["user_id", "name", "year"];

router.get("/", requireAuthUnlessPublic, async (req, res, next) => {
  try {
    const isPublic = parseBoolean(req.query.isPublic);
    const visibility = isPublic === undefined ? {} : { isPublic };
    if (req.query._id !== undefined) {
      const id = parseObjectId(req.query._id);
      if (!id) return res.status(400).json({ msg: "Invalid id" });
      return res
        .status(200)
        .send(await Cup.findOne({ _id: id, ...visibility }));
    }
    const filter = { ...pickQuery(req.query, FIELDS), ...visibility };
    return res.status(200).send(await Cup.find(filter));
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

router.put("/:id/update", requireAuth, async (req, res) => {
  try {
    await Cup.updateOne(
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
    await Cup.replaceOne(
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

router.delete("/:id", requireAuth, async (req, res) => {
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
