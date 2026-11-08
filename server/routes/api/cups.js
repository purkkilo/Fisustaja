const express = require("express");
const { pickQuery, parseObjectId, parseBoolean } = require("../../utils/query");
const { ok, created, mutated, fail } = require("../../utils/responses");
const { sanitizeUpdate } = require("../../utils/updates");
const {
  isAdmin,
  scopeOwnerFilter,
  requireCupAccess,
  withOwner,
} = require("../../utils/ownership");
const router = express.Router();
const Cup = require("../../models/Cup");
const {
  requireAuth,
  requireAuthUnlessPublic,
} = require("../../middleware/auth");

const FIELDS = ["user_id", "name", "year"];

router.get("/", requireAuthUnlessPublic, async (req, res, next) => {
  try {
    const isPublic = parseBoolean(req.query.isPublic);
    const visibility = isPublic === undefined ? {} : { isPublic };

    if (req.query._id !== undefined) {
      const id = parseObjectId(req.query._id);
      if (!id) return fail(res, 400, "Invalid id");
      const filter = { _id: id, ...visibility };
      if (isPublic !== true && req.user && !isAdmin(req.user)) {
        scopeOwnerFilter(req, filter);
      }
      const doc = await Cup.findOne(filter);
      if (!doc) return fail(res, 404, "Not found");
      return ok(res, doc);
    }

    const filter = { ...pickQuery(req.query, FIELDS), ...visibility };
    if (isPublic !== true && req.user && !isAdmin(req.user)) {
      scopeOwnerFilter(req, filter);
    }
    return ok(res, await Cup.find(filter));
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length) {
      return fail(res, 400, "No cups in request");
    }
    const docs = req.body.map((item) => withOwner(req.user, item));
    if (docs.length === 1) {
      const saved = await new Cup(docs[0]).save();
      return created(res, saved);
    }
    const saved = await Cup.insertMany(docs);
    return created(res, saved);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/update", requireAuth, async (req, res, next) => {
  try {
    const cup = await requireCupAccess(req, res, req.params.id);
    if (!cup) return;

    const { update, error } = sanitizeUpdate(req.body, ["user_id"]);
    if (error) return fail(res, 400, error);
    if (!Object.keys(update).length) return mutated(res);

    const result = await Cup.updateOne({ _id: cup._id }, update);
    if (result.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/replace", requireAuth, async (req, res, next) => {
  try {
    const cup = await requireCupAccess(req, res, req.params.id);
    if (!cup) return;

    const replacement = { ...req.body };
    delete replacement._id;
    replacement.user_id = cup.user_id;

    const result = await Cup.replaceOne({ _id: cup._id }, replacement);
    if (result.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const cup = await requireCupAccess(req, res, req.params.id);
    if (!cup) return;

    const result = await Cup.deleteOne({ _id: cup._id });
    if (result.deletedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
