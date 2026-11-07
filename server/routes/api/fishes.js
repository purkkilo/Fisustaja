const express = require("express");
const { pickQuery, parseObjectId } = require("../../utils/query");
const { publicScope } = require("../../utils/publicScope");
const { ok, created, mutated, fail } = require("../../utils/responses");
const { requireParentCompetitionAccess } = require("../../utils/ownership");
const router = express.Router();
const Fish = require("../../models/Fish");
const { requireAuth, optionalAuth } = require("../../middleware/auth");

const FIELDS = ["competition_id", "cup_id", "boat_number", "fish_id"];

async function loadFish(id) {
  const oid = parseObjectId(id);
  if (!oid) return { error: "invalid" };
  const fish = await Fish.findById(oid);
  if (!fish) return { error: "missing" };
  return { fish };
}

async function requireFishAccess(req, res, id) {
  const loaded = await loadFish(id);
  if (loaded.error === "invalid") {
    fail(res, 400, "Invalid id");
    return null;
  }
  if (loaded.error === "missing") {
    fail(res, 404, "Not found");
    return null;
  }
  const competition = await requireParentCompetitionAccess(
    req,
    res,
    loaded.fish.competition_id,
  );
  if (!competition) return null;
  return loaded.fish;
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const filter = pickQuery(req.query, FIELDS);
    if (!req.user) {
      if (req.query.isPublic !== "true") {
        return fail(res, 401, "Unauthorized access");
      }
      const scope = await publicScope(filter);
      if (!scope) return fail(res, 404, "Not found");
      Object.assign(filter, scope);
    }

    if (req.query._id !== undefined) {
      const id = parseObjectId(req.query._id);
      if (!id) return fail(res, 400, "Invalid id");
      const doc = await Fish.findOne({ ...filter, _id: id });
      if (!doc) return fail(res, 404, "Not found");
      return ok(res, doc);
    }
    return ok(res, await Fish.find(filter));
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length) {
      return fail(res, 400, "No fishes in request");
    }

    for (const item of req.body) {
      const parent = await requireParentCompetitionAccess(
        req,
        res,
        item.competition_id,
      );
      if (!parent) return;
    }

    if (req.body.length === 1) {
      const saved = await new Fish(req.body[0]).save();
      return created(res, saved);
    }
    const saved = await Fish.insertMany(req.body);
    return created(res, saved);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/update", requireAuth, async (req, res, next) => {
  try {
    const fish = await requireFishAccess(req, res, req.params.id);
    if (!fish) return;

    if (req.body.competition_id !== undefined) {
      const parent = await requireParentCompetitionAccess(
        req,
        res,
        req.body.competition_id,
      );
      if (!parent) return;
    }

    const result = await Fish.updateOne({ _id: fish._id }, req.body);
    if (result.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/replace", requireAuth, async (req, res, next) => {
  try {
    const fish = await requireFishAccess(req, res, req.params.id);
    if (!fish) return;

    const competitionId = req.body.competition_id || fish.competition_id;
    const parent = await requireParentCompetitionAccess(req, res, competitionId);
    if (!parent) return;

    const replacement = { ...req.body };
    delete replacement._id;
    replacement.competition_id = competitionId;

    const result = await Fish.replaceOne({ _id: fish._id }, replacement);
    if (result.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const fish = await requireFishAccess(req, res, req.params.id);
    if (!fish) return;

    const result = await Fish.deleteOne({ _id: fish._id });
    if (result.deletedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
