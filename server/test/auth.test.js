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

const users = loadRouter("users");

beforeEach(async () => {
  resetDb();
  await addUser({ name: "admin", is_admin: true });
  await addUser({ name: "matti" });
});

test("login rejects missing and non-string credentials without crashing", async () => {
  for (const body of [
    undefined,
    { name: "matti" },
    { name: { $ne: null }, password: "secret" },
    { name: "matti", password: { $gt: "" } },
  ]) {
    const res = await call(users, "POST", "/login", { body });
    assert.equal(res.statusCode, 400, JSON.stringify(body));
  }
});

test("unknown user and wrong password get the same answer", async () => {
  const unknown = await call(users, "POST", "/login", {
    body: { name: "nobody", password: "x" },
  });
  const wrong = await call(users, "POST", "/login", {
    body: { name: "matti", password: "x" },
  });
  assert.equal(unknown.statusCode, 401);
  assert.equal(wrong.statusCode, 401);
  assert.deepEqual(unknown.body, wrong.body);
});

test("login sets both cookies and starts a session", async () => {
  const cookies = await login("matti");
  assert.ok(cookies.access_token && cookies.refresh_token);
  const user = await models.User.findOne({ name: "matti" });
  assert.equal(user.sessions.length, 1);

  const me = await call(users, "GET", "/me", { cookies });
  assert.equal(me.statusCode, 200);
  assert.equal(me.body.user.name, "matti");
  assert.equal(me.body.user.password, undefined);
});

test("a refresh token is not accepted as an access token", async () => {
  const { refresh_token } = await login("matti");
  const viaCookie = await call(users, "GET", "/me", {
    cookies: { access_token: refresh_token },
  });
  const viaHeader = await call(users, "GET", "/me", {
    headers: { authorization: `Bearer ${refresh_token}` },
  });
  assert.equal(viaCookie.statusCode, 401);
  assert.equal(viaHeader.statusCode, 401);
});

test("an access token is not accepted by /refresh", async () => {
  const { access_token } = await login("matti");
  const res = await call(users, "POST", "/refresh", {
    cookies: { refresh_token: access_token },
  });
  assert.equal(res.statusCode, 401);
});

test("refresh issues new cookies for the same session", async () => {
  const { refresh_token } = await login("matti");
  const res = await call(users, "POST", "/refresh", {
    cookies: { refresh_token },
  });
  assert.equal(res.statusCode, 200);
  assert.ok(res.cookies.access_token);
  const user = await models.User.findOne({ name: "matti" });
  assert.equal(user.sessions.length, 1);
});

test("logout ends only that browser's session", async () => {
  const phone = await login("matti");
  const laptop = await login("matti");

  const out = await call(users, "POST", "/logout", { cookies: phone });
  assert.equal(out.statusCode, 200);
  assert.deepEqual(out.cleared.sort(), ["access_token", "refresh_token"]);

  const phoneMe = await call(users, "GET", "/me", { cookies: phone });
  const phoneRefresh = await call(users, "POST", "/refresh", {
    cookies: phone,
  });
  const laptopMe = await call(users, "GET", "/me", { cookies: laptop });
  assert.equal(phoneMe.statusCode, 401);
  assert.equal(phoneRefresh.statusCode, 401);
  assert.equal(laptopMe.statusCode, 200);
});

test("too many failed logins from one IP are limited", async () => {
  const attempt = (password, ip) =>
    call(users, "POST", "/login", { body: { name: "admin", password }, ip });
  for (let i = 0; i < 10; i++) await attempt("wrong", "10.0.0.1");

  const blocked = await attempt("secret", "10.0.0.1");
  assert.equal(blocked.statusCode, 429);
  assert.ok(Number(blocked.headers["Retry-After"]) > 0);

  const otherIp = await attempt("secret", "10.0.0.2");
  assert.equal(otherIp.statusCode, 200);
});

test("only admins can register users; passwords are hashed", async () => {
  const body = {
    name: "new",
    email: "new@x",
    password: "pw",
    is_admin: "false",
  };

  const asUser = await call(users, "POST", "/register", {
    cookies: await login("matti"),
    body,
  });
  assert.equal(asUser.statusCode, 403);

  const admin = await login("admin");
  const asAdmin = await call(users, "POST", "/register", {
    cookies: admin,
    body,
  });
  assert.equal(asAdmin.statusCode, 201);
  const created = await models.User.findOne({ name: "new" });
  assert.equal(created.is_admin, false);
  assert.notEqual(created.password, "pw");

  const duplicate = await call(users, "POST", "/register", {
    cookies: admin,
    body: { ...body, name: "other" },
  });
  assert.equal(duplicate.statusCode, 409);
});
