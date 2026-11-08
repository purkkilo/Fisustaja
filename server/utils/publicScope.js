const Competition = require("../models/Competition");
const Cup = require("../models/Cup");
const { parseObjectId } = require("./query");

/**
 * Extra filter that limits results/fishes to public data, for requests
 * without a login. Needs a competition_id of a public competition, or a
 * cup_id of a public cup (then only its public competitions count).
 * @returns {Promise<object|null>} filter to merge, or null when not allowed
 */
async function publicScope(filter) {
  if (filter.competition_id) {
    const id = parseObjectId(filter.competition_id);
    const allowed =
      id && (await Competition.exists({ _id: id, isPublic: true }));
    return allowed ? {} : null;
  }
  if (filter.cup_id) {
    const id = parseObjectId(filter.cup_id);
    if (!id || !(await Cup.exists({ _id: id, isPublic: true }))) return null;
    const competitions = await Competition.find(
      { cup_id: filter.cup_id, isPublic: true },
      "_id",
    ).lean();
    return {
      competition_id: { $in: competitions.map((c) => String(c._id)) },
    };
  }
  return null;
}

/**
 * Extra filter for logged-in users: results/fishes of their own competitions
 * and of public ones. Admins see everything.
 * @returns {Promise<object>} filter to merge
 */
async function userScope(user, filter) {
  if (user?.is_admin) return {};
  const competitionFilter = {
    $or: [{ user_id: String(user._id) }, { isPublic: true }],
  };
  if (filter.competition_id) {
    const id = parseObjectId(filter.competition_id);
    if (!id) return { competition_id: { $in: [] } };
    competitionFilter._id = id;
  } else if (filter.cup_id) {
    competitionFilter.cup_id = filter.cup_id;
  }
  const competitions = await Competition.find(competitionFilter, "_id").lean();
  return {
    competition_id: { $in: competitions.map((c) => String(c._id)) },
  };
}

module.exports = { publicScope, userScope };
