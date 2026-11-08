// Ownership and visibility of competitions, cups and results.
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const {
  models,
  resetDb,
  loadRouter,
  call,
  addUser,
  login,
} = require("./helpers");

const competitions = loadRouter("competitions");
const cups = loadRouter("cups");
const results = loadRouter("results");

let matti, liisa, admin;
let mattiCup, mattiPrivate, mattiPublic, liisaCup;

beforeEach(async () => {
  resetDb();
  const m = await addUser({ name: "matti" });
  const l = await addUser({ name: "liisa" });
  await addUser({ name: "admin", is_admin: true });
  matti = await login("matti");
  liisa = await login("liisa");
  admin = await login("admin");

  mattiCup = models.Cup.add({
    user_id: String(m._id),
    name: "M",
    isPublic: true,
  });
  liisaCup = models.Cup.add({
    user_id: String(l._id),
    name: "L",
    isPublic: false,
  });
  mattiPrivate = models.Competition.add({
    user_id: String(m._id),
    cup_id: String(mattiCup._id),
    name: "Private",
    isPublic: false,
  });
  mattiPublic = models.Competition.add({
    user_id: String(m._id),
    cup_id: String(mattiCup._id),
    name: "Public",
    isPublic: true,
  });
  for (const c of [mattiPrivate, mattiPublic]) {
    models.Result.add({
      competition_id: String(c._id),
      cup_id: String(mattiCup._id),
      boat_number: 1,
      captain_name: `${c.name} captain`,
    });
  }
});

const names = (res) => res.body.map((r) => r.captain_name).sort();

// ---- reading -----------------------------------------------------------------

test("logged-out visitors only get results of public competitions", async () => {
  const noFlag = await call(results, "GET", "/", { query: {} });
  assert.equal(noFlag.statusCode, 401);

  const privateOne = await call(results, "GET", "/", {
    query: { isPublic: "true", competition_id: String(mattiPrivate._id) },
  });
  assert.equal(privateOne.statusCode, 404);

  const byCup = await call(results, "GET", "/", {
    query: { isPublic: "true", cup_id: String(mattiCup._id) },
  });
  assert.deepEqual(names(byCup), ["Public captain"]);
});

test("logged-in users see their own and public results, admins see all", async () => {
  const own = await call(results, "GET", "/", { cookies: matti });
  assert.deepEqual(names(own), ["Private captain", "Public captain"]);

  const other = await call(results, "GET", "/", { cookies: liisa });
  assert.deepEqual(names(other), ["Public captain"]);

  const direct = await call(results, "GET", "/", {
    cookies: liisa,
    query: { competition_id: String(mattiPrivate._id) },
  });
  assert.deepEqual(direct.body, []);

  const all = await call(results, "GET", "/", { cookies: admin });
  assert.equal(all.body.length, 2);
});

test("query operators in the URL are ignored", async () => {
  const res = await call(results, "GET", "/", {
    cookies: liisa,
    query: { competition_id: { $ne: "x" } },
  });
  assert.deepEqual(names(res), ["Public captain"]);
});

test("non-admins only list their own competitions, whatever user_id they ask for", async () => {
  const res = await call(competitions, "GET", "/", {
    cookies: liisa,
    query: { user_id: String(mattiPrivate.user_id) },
  });
  assert.deepEqual(res.body, []);
});

test("a malformed id is a 400, not a crash", async () => {
  const res = await call(competitions, "GET", "/", {
    cookies: matti,
    query: { _id: "not-an-id" },
  });
  assert.equal(res.statusCode, 400);
});

// ---- writing -----------------------------------------------------------------

test("only the owner (or an admin) can change or delete a competition", async () => {
  const id = String(mattiPrivate._id);
  const update = (cookies) =>
    call(competitions, "PUT", "/:id/update", {
      cookies,
      params: { id },
      body: { $set: { name: "Changed" } },
    });

  assert.equal((await update(liisa)).statusCode, 403);
  assert.equal((await update(matti)).statusCode, 200);
  assert.equal((await update(admin)).statusCode, 200);

  const del = await call(competitions, "DELETE", "/:id", {
    cookies: liisa,
    params: { id },
  });
  assert.equal(del.statusCode, 403);
  assert.ok(await models.Competition.findById(id));
});

test("deleting a competition also deletes its results and fishes", async () => {
  const id = String(mattiPrivate._id);
  const otherId = String(mattiPublic._id);
  models.Fish.add({ competition_id: id, name: "Hauki", weight: 1200 });
  models.Fish.add({ competition_id: otherId, name: "Ahven", weight: 300 });

  const del = await call(competitions, "DELETE", "/:id", {
    cookies: matti,
    params: { id },
  });
  assert.equal(del.statusCode, 200);
  assert.equal(await models.Competition.findById(id), null);

  const left = (model) => model.all().map((d) => d.competition_id);
  // the other competition keeps its rows
  assert.deepEqual(left(models.Result), [otherId]);
  assert.deepEqual(left(models.Fish), [otherId]);
});

test("updates cannot change the owner", async () => {
  const id = String(mattiPrivate._id);
  const liisaId = String((await models.User.findOne({ name: "liisa" }))._id);

  const res = await call(competitions, "PUT", "/:id/update", {
    cookies: matti,
    params: { id },
    body: { user_id: liisaId, $set: { user_id: liisaId, name: "Still mine" } },
  });
  assert.equal(res.statusCode, 200);
  const doc = await models.Competition.findById(id);
  assert.equal(doc.user_id, mattiPrivate.user_id);
  assert.equal(doc.name, "Still mine");

  const rename = await call(competitions, "PUT", "/:id/update", {
    cookies: matti,
    params: { id },
    body: { $rename: { name: "user_id" } },
  });
  assert.equal(rename.statusCode, 400);
});

test("a competition can't be put into someone else's cup", async () => {
  const toLiisasCup = await call(competitions, "PUT", "/:id/update", {
    cookies: matti,
    params: { id: String(mattiPrivate._id) },
    body: { $set: { cup_id: String(liisaCup._id) } },
  });
  assert.equal(toLiisasCup.statusCode, 403);

  const create = await call(competitions, "POST", "/", {
    cookies: liisa,
    body: [{ name: "Sneaky", cup_id: String(mattiCup._id) }],
  });
  assert.equal(create.statusCode, 403);
});

test("created competitions and cups belong to the logged-in user", async () => {
  const liisaId = String((await models.User.findOne({ name: "liisa" }))._id);
  const res = await call(cups, "POST", "/", {
    cookies: liisa,
    body: [{ name: "New cup", user_id: String(mattiPrivate.user_id) }],
  });
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.data.user_id, liisaId);
});

test("results can't be edited in, or moved out of, someone else's competition", async () => {
  const [result] = await models.Result.find({
    competition_id: String(mattiPrivate._id),
  });
  const id = String(result._id);

  const byLiisa = await call(results, "PUT", "/:id/update", {
    cookies: liisa,
    params: { id },
    body: { $set: { captain_name: "Hacked" } },
  });
  assert.equal(byLiisa.statusCode, 403);

  const move = await call(results, "PUT", "/:id/update", {
    cookies: matti,
    params: { id },
    body: { $set: { competition_id: "elsewhere", captain_name: "Moved?" } },
  });
  assert.equal(move.statusCode, 200);
  const doc = await models.Result.findById(id);
  assert.equal(doc.competition_id, String(mattiPrivate._id));
  assert.equal(doc.captain_name, "Moved?");

  const many = await call(results, "PUT", "/update-many", {
    cookies: liisa,
    body: { ids: [id], valueToSet: { $set: { returned: true } } },
  });
  assert.equal(many.statusCode, 403);
});
