const express = require("express");
const mongodb = require("mongodb");
const { pickQuery, parseObjectId } = require("../../utils/query");
const { publicScope } = require("../../utils/publicScope");
const router = express.Router();
const Fish = require("../../models/Fish");
const { requireAuth, optionalAuth } = require("../../middleware/auth");

// Query fields the client may filter by
const FIELDS = ["competition_id", "cup_id", "boat_number", "fish_id"];

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const filter = pickQuery(req.query, FIELDS);
    if (!req.user) {
      // Without a login, only data of public competitions/cups
      if (req.query.isPublic !== "true") {
        return res
          .status(401)
          .json({ error: "Unauthorized access", success: false });
      }
      const scope = await publicScope(filter);
      if (!scope) return res.status(404).json({ msg: "Not found" });
      Object.assign(filter, scope);
    }
    if (req.query._id !== undefined) {
      const id = parseObjectId(req.query._id);
      if (!id) return res.status(400).json({ msg: "Invalid id" });
      return res.status(200).send(await Fish.findOne({ ...filter, _id: id }));
    }
    return res.status(200).send(await Fish.find(filter));
  } catch (err) {
    return next(err);
  }
});

// Add fishes
router.post("/", requireAuth, async (req, res) => {
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
router.put("/:id/update", requireAuth, async (req, res) => {
  try {
    await Fish.updateOne(
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

// Replace one fish
router.put("/:id/replace", requireAuth, async (req, res) => {
  try {
    await Fish.replaceOne(
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

// Delete fishes
router.delete("/:id", requireAuth, async (req, res) => {
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
