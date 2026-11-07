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

module.exports = { publicScope };
