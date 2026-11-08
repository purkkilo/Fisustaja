const express = require("express");
const { pickQuery, parseObjectId, parseBoolean } = require("../../utils/query");
const { ok, created, mutated, fail } = require("../../utils/responses");
const { sanitizeUpdate, updatedValue } = require("../../utils/updates");
const {
  isAdmin,
  scopeOwnerFilter,
  requireCompetitionAccess,
  checkCupLink,
  withOwner,
} = require("../../utils/ownership");
const router = express.Router();
const Competition = require("../../models/Competition");
const {
  requireAuth,
  requireAuthUnlessPublic,
} = require("../../middleware/auth");

const FIELDS = ["cup_id", "user_id", "state"];

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
      const doc = await Competition.findOne(filter);
      if (!doc) return fail(res, 404, "Not found");
      return ok(res, doc);
    }

    const filter = { ...pickQuery(req.query, FIELDS), ...visibility };
    if (isPublic !== true && req.user && !isAdmin(req.user)) {
      scopeOwnerFilter(req, filter);
    }
    return ok(res, await Competition.find(filter));
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length) {
      return fail(res, 400, "No competitions in request");
    }
    for (const item of req.body) {
      if (!(await checkCupLink(req, res, item?.cup_id))) return;
    }
    const docs = req.body.map((item) => withOwner(req.user, item));
    if (docs.length === 1) {
      const saved = await new Competition(docs[0]).save();
      return created(res, saved);
    }
    const saved = await Competition.insertMany(docs);
    return created(res, saved);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/update", requireAuth, async (req, res, next) => {
  try {
    const competition = await requireCompetitionAccess(req, res, req.params.id);
    if (!competition) return;

    const { update, error } = sanitizeUpdate(req.body, ["user_id"]);
    if (error) return fail(res, 400, error);
    if (!(await checkCupLink(req, res, updatedValue(req.body, "cup_id"))))
      return;
    if (!Object.keys(update).length) return mutated(res);

    const result = await Competition.updateOne(
      { _id: competition._id },
      update,
    );
    if (result.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id/replace", requireAuth, async (req, res, next) => {
  try {
    const competition = await requireCompetitionAccess(req, res, req.params.id);
    if (!competition) return;

    if (!(await checkCupLink(req, res, req.body?.cup_id))) return;
    const replacement = withOwner(req.user, { ...req.body });
    // Keep original owner unless admin is replacing (still force session user per plan)
    delete replacement._id;
    replacement.user_id = competition.user_id;

    const result = await Competition.replaceOne(
      { _id: competition._id },
      replacement,
    );
    if (result.matchedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.put("/replace-many", requireAuth, async (req, res, next) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length) {
      return fail(res, 400, "No competitions in request");
    }

    const ops = [];
    for (const item of req.body) {
      const competition = await requireCompetitionAccess(req, res, item._id);
      if (!competition) return;
      if (!(await checkCupLink(req, res, item.cup_id))) return;
      const replacement = { ...item };
      delete replacement._id;
      replacement.user_id = competition.user_id;
      ops.push({
        replaceOne: {
          filter: { _id: competition._id },
          replacement,
        },
      });
    }

    await Competition.bulkWrite(ops);
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const competition = await requireCompetitionAccess(req, res, req.params.id);
    if (!competition) return;

    const result = await Competition.deleteOne({ _id: competition._id });
    if (result.deletedCount === 0) return fail(res, 404, "Not found");
    return mutated(res);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
