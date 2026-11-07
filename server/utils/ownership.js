const Competition = require("../models/Competition");
const Cup = require("../models/Cup");
const { parseObjectId } = require("./query");
const { fail } = require("./responses");

function isAdmin(user) {
  return !!user?.is_admin;
}

function owns(user, resource) {
  return !!user && !!resource && String(resource.user_id) === String(user._id);
}

function canAccess(user, resource) {
  return isAdmin(user) || owns(user, resource);
}

/**
 * For private (non-public) list/get queries: non-admins only see their own rows.
 * Always overwrites user_id so a client cannot query someone else's data.
 * Mutates `filter` in place.
 */
function scopeOwnerFilter(req, filter) {
  if (isAdmin(req.user)) return;
  filter.user_id = String(req.user._id);
}

async function loadCup(id) {
  const oid = parseObjectId(id);
  if (!oid) return { error: "invalid" };
  const cup = await Cup.findById(oid);
  if (!cup) return { error: "missing" };
  return { cup };
}

async function loadCompetition(id) {
  const oid = parseObjectId(id);
  if (!oid) return { error: "invalid" };
  const competition = await Competition.findById(oid);
  if (!competition) return { error: "missing" };
  return { competition };
}

/** Load cup and enforce owner-or-admin. Sends response on failure; returns null. */
async function requireCupAccess(req, res, id) {
  const loaded = await loadCup(id);
  if (loaded.error === "invalid") {
    fail(res, 400, "Invalid id");
    return null;
  }
  if (loaded.error === "missing") {
    fail(res, 404, "Not found");
    return null;
  }
  if (!canAccess(req.user, loaded.cup)) {
    fail(res, 403, "Forbidden");
    return null;
  }
  return loaded.cup;
}

/** Load competition and enforce owner-or-admin. Sends response on failure; returns null. */
async function requireCompetitionAccess(req, res, id) {
  const loaded = await loadCompetition(id);
  if (loaded.error === "invalid") {
    fail(res, 400, "Invalid id");
    return null;
  }
  if (loaded.error === "missing") {
    fail(res, 404, "Not found");
    return null;
  }
  if (!canAccess(req.user, loaded.competition)) {
    fail(res, 403, "Forbidden");
    return null;
  }
  return loaded.competition;
}

/**
 * Resolve parent competition for a result/fish write and enforce ownership.
 * @param {string} competitionId
 */
async function requireParentCompetitionAccess(req, res, competitionId) {
  if (!competitionId) {
    fail(res, 400, "competition_id is required");
    return null;
  }
  return requireCompetitionAccess(req, res, competitionId);
}

/** Force user_id on create payloads to the session user. */
function withOwner(user, doc) {
  return { ...doc, user_id: String(user._id) };
}

module.exports = {
  isAdmin,
  owns,
  canAccess,
  scopeOwnerFilter,
  loadCup,
  loadCompetition,
  requireCupAccess,
  requireCompetitionAccess,
  requireParentCompetitionAccess,
  withOwner,
};
