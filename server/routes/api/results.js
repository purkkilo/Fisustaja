const express = require("express");
const mongodb = require("mongodb");
const { pickQuery, parseObjectId } = require("../../utils/query");
const { publicScope } = require("../../utils/publicScope");
const router = express.Router();
const Result = require("../../models/Result");
const { requireAuth, optionalAuth } = require("../../middleware/auth");

// Query fields the client may filter by
const FIELDS = ["competition_id", "cup_id", "boat_number"];

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
      return res.status(200).send(await Result.findOne({ ...filter, _id: id }));
    }
    return res.status(200).send(await Result.find(filter));
  } catch (err) {
    return next(err);
  }
});

// Add results
router.post("/", requireAuth, async (req, res) => {
  try {
    let newResult = {};
    if (!req.body.length) {
      res.status(400).send("No results in request");
      return;
    }

    if (req.body.length === 1) {
      newResult = new Result(req.body[0]);
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
      id: newResult._id,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update one result
router.put("/:id/update", requireAuth, async (req, res) => {
  try {
    await Result.updateOne(
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

// Update many results
router.put("/update-many", requireAuth, async (req, res) => {
  try {
    await Result.updateMany(
      {
        _id: {
          $in: req.body.ids,
        },
      },
      req.body.valueToSet,
    ).catch((err) => {
      console.log(err);
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

// Replace one result
router.put("/:id/replace", requireAuth, async (req, res) => {
  try {
    await Result.replaceOne(
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

// Replace many results
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

    await Result.bulkWrite(bulkData).catch((err) => {
      console.log(err);
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete results
router.delete("/:id", requireAuth, async (req, res) => {
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
