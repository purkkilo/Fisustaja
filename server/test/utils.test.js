// Pure helpers used by the routes.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { pickQuery, parseObjectId, parseBoolean } = require("../utils/query");
const { sanitizeUpdate, updatedValue } = require("../utils/updates");

test("pickQuery keeps only whitelisted plain strings", () => {
  assert.deepEqual(
    pickQuery(
      {
        cup_id: "c1",
        user_id: { $ne: null },
        other: "x",
        state: "",
        list: ["a"],
      },
      ["cup_id", "user_id", "state", "list"],
    ),
    { cup_id: "c1" },
  );
});

test("parseObjectId accepts only 24 hex characters", () => {
  assert.equal(
    String(parseObjectId("665e652954728ad48eff6aa0")),
    "665e652954728ad48eff6aa0",
  );
  for (const bad of [
    "xyz",
    "665e652954728ad48eff6aa",
    { $gt: "" },
    undefined,
  ]) {
    assert.equal(parseObjectId(bad), null);
  }
});

test("parseBoolean", () => {
  assert.equal(parseBoolean("true"), true);
  assert.equal(parseBoolean("false"), false);
  assert.equal(parseBoolean("yes"), undefined);
});

test("sanitizeUpdate moves plain fields into $set and drops protected ones", () => {
  assert.deepEqual(
    sanitizeUpdate(
      {
        name: "A",
        user_id: "x",
        _id: "y",
        $set: { state: "ended", "user_id.0": "z" },
      },
      ["user_id"],
    ),
    { update: { $set: { name: "A", state: "ended" } } },
  );
});

test("sanitizeUpdate allows $unset but no other operators", () => {
  assert.deepEqual(sanitizeUpdate({ $unset: { note: "" } }), {
    update: { $unset: { note: "" } },
  });
  for (const body of [
    { $rename: { a: "b" } },
    { $set: ["not", "an", "object"] },
    null,
    [],
  ]) {
    assert.ok(sanitizeUpdate(body).error, JSON.stringify(body));
  }
});

test("sanitizeUpdate can end up empty", () => {
  assert.deepEqual(sanitizeUpdate({ user_id: "x" }, ["user_id"]), {
    update: {},
  });
});

test("updatedValue reads plain fields and $set", () => {
  assert.equal(updatedValue({ cup_id: "a" }, "cup_id"), "a");
  assert.equal(updatedValue({ $set: { cup_id: "b" } }, "cup_id"), "b");
  assert.equal(updatedValue({ name: "x" }, "cup_id"), undefined);
});
