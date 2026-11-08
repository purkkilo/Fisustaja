// Test helpers for the API routes: in-memory stand-ins for the Mongoose
// models, and a way to call a route's handlers directly (real express
// Router, passport, jsonwebtoken and bcryptjs; no database or HTTP server).
const crypto = require("crypto");
const Module = require("module");
const path = require("path");

process.env.SECRET = process.env.SECRET || "test-secret";
process.env.NODE_ENV = "test";

const SERVER = path.join(__dirname, "..");
const newId = () => crypto.randomBytes(12).toString("hex");
const clone = (value) => JSON.parse(JSON.stringify(value));

// ---- in-memory models ----------------------------------------------------

function valueMatches(actual, expected) {
  if (expected && typeof expected === "object" && !expected._bsontype) {
    if ("$in" in expected)
      return expected.$in.map(String).includes(String(actual));
    if ("$lte" in expected) return new Date(actual) <= new Date(expected.$lte);
    if ("$ne" in expected) return String(actual) !== String(expected.$ne);
  }
  return String(actual) === String(expected);
}

function matches(doc, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "$or") return expected.some((f) => matches(doc, f));
    if (key.includes(".")) {
      const [arrayKey, field] = key.split(".");
      return (doc[arrayKey] || []).some((item) =>
        valueMatches(item[field], expected),
      );
    }
    return valueMatches(doc[key], expected);
  });
}

function applyUpdate(doc, update, filter) {
  for (const [op, fields] of Object.entries(update)) {
    if (!op.startsWith("$")) {
      doc[op] = fields;
      continue;
    }
    for (const [key, value] of Object.entries(fields)) {
      if (op === "$set") {
        if (key.includes(".$.")) {
          const [arrayKey, field] = key.split(".$.");
          const [, matchField] = Object.keys(filter)
            .find((k) => k.startsWith(`${arrayKey}.`))
            .split(".");
          const item = doc[arrayKey].find((i) =>
            valueMatches(i[matchField], filter[`${arrayKey}.${matchField}`]),
          );
          item[field] = value;
        } else {
          doc[key] = value;
        }
      } else if (op === "$unset") {
        delete doc[key];
      } else if (op === "$pull") {
        doc[key] = (doc[key] || []).filter((item) => !matches(item, value));
      } else if (op === "$push") {
        const items = value.$each ?? [value];
        doc[key] = [...(doc[key] || []), ...items];
        if (value.$slice) doc[key] = doc[key].slice(value.$slice);
      } else {
        throw new Error(`Fake model does not support ${op}`);
      }
    }
  }
}

function query(promiseOfDocs) {
  promiseOfDocs.lean = () => promiseOfDocs;
  return promiseOfDocs;
}

function createModel(defaults = {}) {
  const store = [];

  class FakeModel {
    constructor(doc) {
      Object.assign(this, { _id: newId(), ...clone(defaults), ...doc });
    }
    async save() {
      store.push(this);
      return this;
    }
    static reset() {
      store.length = 0;
    }
    static all() {
      return store;
    }
    static add(doc) {
      const created = new FakeModel(doc);
      store.push(created);
      return created;
    }
    static find(filter) {
      return query(Promise.resolve(store.filter((d) => matches(d, filter))));
    }
    static async findOne(filter) {
      return store.find((d) => matches(d, filter)) || null;
    }
    static async findById(id) {
      return store.find((d) => String(d._id) === String(id)) || null;
    }
    static async exists(filter) {
      const doc = await FakeModel.findOne(filter);
      return doc ? { _id: doc._id } : null;
    }
    static async create(doc) {
      return FakeModel.add(doc);
    }
    static async insertMany(docs) {
      return docs.map((d) => FakeModel.add(d));
    }
    static async updateOne(filter, update) {
      const doc = store.find((d) => matches(d, filter));
      if (doc) applyUpdate(doc, update, filter);
      return { matchedCount: doc ? 1 : 0 };
    }
    static async updateMany(filter, update) {
      const docs = store.filter((d) => matches(d, filter));
      docs.forEach((d) => applyUpdate(d, update, filter));
      return { matchedCount: docs.length };
    }
    static async replaceOne(filter, replacement) {
      const index = store.findIndex((d) => matches(d, filter));
      if (index > -1)
        store[index] = new FakeModel({ ...replacement, _id: store[index]._id });
      return { matchedCount: index > -1 ? 1 : 0 };
    }
    static async deleteOne(filter) {
      const index = store.findIndex((d) => matches(d, filter));
      if (index > -1) store.splice(index, 1);
      return { deletedCount: index > -1 ? 1 : 0 };
    }
    static async deleteMany(filter) {
      const before = store.length;
      const kept = store.filter((d) => !matches(d, filter));
      store.splice(0, store.length, ...kept);
      return { deletedCount: before - kept.length };
    }
    static async bulkWrite(ops) {
      for (const { replaceOne } of ops) {
        await FakeModel.replaceOne(replaceOne.filter, replaceOne.replacement);
      }
    }
  }
  return FakeModel;
}

const models = {
  User: createModel({ sessions: [] }),
  Competition: createModel(),
  Cup: createModel(),
  Result: createModel(),
  Fish: createModel(),
};

// Routes require "../../models/X": serve the fakes from the module cache
for (const [name, model] of Object.entries(models)) {
  const file = path.join(SERVER, "models", `${name}.js`);
  const fake = new Module(file);
  fake.filename = file;
  fake.loaded = true;
  fake.exports = model;
  require.cache[file] = fake;
}

const passport = require("passport");
require(path.join(SERVER, "config/passport"))(passport);

function resetDb() {
  Object.values(models).forEach((m) => m.reset());
}

// ---- calling routes --------------------------------------------------------

function loadRouter(name) {
  return require(path.join(SERVER, "routes/api", `${name}.js`));
}

function findHandlers(router, method, routePath) {
  const layer = router.stack.find(
    (l) => l.route?.path === routePath && l.route.methods[method.toLowerCase()],
  );
  if (!layer) throw new Error(`No route ${method} ${routePath}`);
  return layer.route.stack.map((l) => l.handle);
}

/**
 * Run a route's middleware chain with a fake request.
 * @returns {Promise<{statusCode, body, cookies, cleared, headers}>}
 */
function call(router, method, routePath, request = {}) {
  const handlers = findHandlers(router, method, routePath);
  const req = {
    method,
    url: routePath,
    headers: {},
    query: {},
    params: {},
    cookies: {},
    ip: "127.0.0.1",
    ...request,
  };
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      body: undefined,
      cookies: {},
      cleared: [],
      headers: {},
      headersSent: false,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        this.headersSent = true;
        resolve(this);
        return this;
      },
      send(body) {
        return this.json(body);
      },
      set(key, value) {
        this.headers[key] = value;
        return this;
      },
      cookie(name, value) {
        this.cookies[name] = value;
        return this;
      },
      clearCookie(name) {
        this.cleared.push(name);
        return this;
      },
    };
    let index = 0;
    const next = (err) => {
      if (err) {
        res.statusCode = 500;
        res.body = { error: err.message };
        return resolve(res);
      }
      const handler = handlers[index++];
      if (!handler) return resolve(res);
      Promise.resolve()
        .then(() => handler(req, res, next))
        .catch(next);
    };
    next();
  });
}

// ---- users and login -------------------------------------------------------

const bcrypt = require("bcryptjs");

async function addUser({ name, password = "secret", is_admin = false }) {
  return models.User.add({
    name,
    email: `${name}@example.com`,
    password: await bcrypt.hash(password, 4),
    is_admin,
    sessions: [],
  });
}

/** Log in through the real route; returns the auth cookies. */
async function login(name, password = "secret") {
  const res = await call(loadRouter("users"), "POST", "/login", {
    body: { name, password },
  });
  if (res.statusCode !== 200) {
    throw new Error(`login failed: ${res.statusCode}`);
  }
  return res.cookies;
}

module.exports = { models, resetDb, loadRouter, call, addUser, login, newId };
