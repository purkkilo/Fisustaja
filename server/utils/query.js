const mongodb = require("mongodb");

/**
 * Copy only whitelisted query parameters, and only when they are plain
 * strings. Express parses `?a[$ne]=x` into objects; dropping anything that
 * isn't a string keeps Mongo operators out of the filters.
 */
function pickQuery(query, allowed) {
  const filter = {};
  for (const key of allowed) {
    const value = query[key];
    if (typeof value === "string" && value !== "") filter[key] = value;
  }
  return filter;
}

/** ObjectId from a 24-char hex string, or null when it isn't one. */
function parseObjectId(value) {
  return typeof value === "string" && /^[0-9a-f]{24}$/i.test(value)
    ? mongodb.ObjectId.createFromHexString(value)
    : null;
}

/** `isPublic` query param as a boolean, or undefined when absent. */
function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

module.exports = { pickQuery, parseObjectId, parseBoolean };
