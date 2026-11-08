// Client-sent update documents for the `/:id/update` and `update-many`
// routes. Only plain fields, `$set` and `$unset` are accepted, and protected
// fields (owner, parent links) are removed from all of them, so an update
// like `{ $set: { user_id } }` or `{ $rename: ... }` can't change ownership.
const ALLOWED_OPERATORS = new Set(["$set", "$unset"]);

const isPlainObject = (value) =>
  !!value && typeof value === "object" && !Array.isArray(value);

function isProtected(key, protectedFields) {
  return protectedFields.some((f) => key === f || key.startsWith(`${f}.`));
}

function strip(fields, protectedFields) {
  const kept = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!isProtected(key, protectedFields)) kept[key] = value;
  }
  return kept;
}

/**
 * @param {object} body update sent by the client
 * @param {string[]} protectedFields fields the client may not change
 * @returns {{ update?: object, error?: string }} `update` may be empty
 */
function sanitizeUpdate(body, protectedFields = []) {
  if (!isPlainObject(body)) return { error: "Invalid update" };
  const guarded = ["_id", ...protectedFields];
  const plain = {};
  const update = {};
  for (const [key, value] of Object.entries(body)) {
    if (!key.startsWith("$")) {
      plain[key] = value;
    } else if (!ALLOWED_OPERATORS.has(key) || !isPlainObject(value)) {
      return { error: `Update operator ${key} is not allowed` };
    } else {
      update[key] = strip(value, guarded);
    }
  }
  const plainKept = strip(plain, guarded);
  if (Object.keys(plainKept).length) {
    update.$set = { ...plainKept, ...(update.$set || {}) };
  }
  for (const op of Object.keys(update)) {
    if (!Object.keys(update[op]).length) delete update[op];
  }
  return { update };
}

/** Value a field would get from an update (plain or `$set`), if any. */
function updatedValue(body, field) {
  if (!isPlainObject(body)) return undefined;
  if (isPlainObject(body.$set) && field in body.$set) return body.$set[field];
  return body[field];
}

module.exports = { sanitizeUpdate, updatedValue };
