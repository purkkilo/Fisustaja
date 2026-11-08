const express = require("express");
const { pickQuery, parseObjectId } = require("../../utils/query");
const { publicScope, userScope } = require("../../utils/publicScope");
const { sanitizeUpdate } = require("../../utils/updates");
const { ok, created, mutated, fail } = require("../../utils/responses");
const { requireParentCompetitionAccess } = require("../../utils/ownership");
const router = express.Router();
const Result = require("../../models/Result");
const { requireAuth, optionalAuth } = require("../../middleware/auth");

const PROTECTED = ["competition_id", "cup_id"];
const FIELDS = ["competition_id", "cup_id", "boat_number"];

async function loadResult(id) {
  const oid = parseObjectId(id);
  if (!oid) return { error: "invalid" };
  const result = await Result.findById(oid);
  if (!result) return { error: "missing" };
  return { result };
}

async function requireResultAccess(req, res, id) {
  const loaded = await loadResult(id);
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
    loaded.result.competition_id,
  );
  if (!competition) return null;
  return loaded.result;
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
    } else {
      // Own competitions and public ones (admins: everything)
      Object.assign(filter, await userScope(req.user, filter));
    }

    if (req.query._id !== undefined) {
      const id = parseObjectId(req.query._id);
      if (!id) return fail(res, 400, "Invalid id");
      const doc = await Result.findOne({ ...filter, _id: id });
      if (!doc) return fail(res, 404, "Not found");
      return ok(res, doc);
    }
    return ok(res, await Result.find(filter));
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length) {
      return fail(res, 400, "No results in request");
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
      const saved = await new Result(req.body[0]).save();
      return created(res, saved);
    }
    const saved = await Result.insertMany(req.body);
    return created(res, saved);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/update", requireAuth, async (req, res, next) => {
  try {
    const result = await requireResultAccess(req, res, req.params.id);
    if (!result) return;

    // Moving a row to another competition isn't an update; use replace
    const { update, error } = sanitizeUpdate(req.body, PROTECTED);
    if (error) return fail(res, 400, error);
    if (!Object.keys(update).length) return mutated(res);

    const updateResult = await Result.updateOne({ _id: result._id }, update);
    if (updateResult.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/update-many", requireAuth, async (req, res, next) => {
  try {
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || !ids.length) {
      return fail(res, 400, "No results in request");
    }

    const { update, error } = sanitizeUpdate(req.body.valueToSet, PROTECTED);
    if (error) return fail(res, 400, error);

    const objectIds = [];
    for (const id of ids) {
      const result = await requireResultAccess(req, res, id);
      if (!result) return;
      objectIds.push(result._id);
    }

    if (Object.keys(update).length) {
      await Result.updateMany({ _id: { $in: objectIds } }, update);
    }
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/replace", requireAuth, async (req, res, next) => {
  try {
    const result = await requireResultAccess(req, res, req.params.id);
    if (!result) return;

    const competitionId = req.body.competition_id || result.competition_id;
    const parent = await requireParentCompetitionAccess(
      req,
      res,
      competitionId,
    );
    if (!parent) return;

    const replacement = { ...req.body };
    delete replacement._id;
    replacement.competition_id = competitionId;

    const updateResult = await Result.replaceOne(
      { _id: result._id },
      replacement,
    );
    if (updateResult.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/replace-many", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length) {
      return fail(res, 400, "No results in request");
    }

    const ops = [];
    for (const item of req.body) {
      const existing = await requireResultAccess(req, res, item._id);
      if (!existing) return;
      const competitionId = item.competition_id || existing.competition_id;
      const parent = await requireParentCompetitionAccess(
        req,
        res,
        competitionId,
      );
      if (!parent) return;
      const replacement = { ...item };
      delete replacement._id;
      replacement.competition_id = competitionId;
      ops.push({
        replaceOne: {
          filter: { _id: existing._id },
          replacement,
        },
      });
    }

    await Result.bulkWrite(ops);
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await requireResultAccess(req, res, req.params.id);
    if (!result) return;

    const deleteResult = await Result.deleteOne({ _id: result._id });
    if (deleteResult.deletedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
