// Small in-memory limiter for failed logins: at most MAX_FAILURES per
// username + IP within WINDOW_MS. Counts reset on a successful login and
// on server restart, which is fine for one server instance.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

const failures = new Map(); // key -> [timestamps]

const keyOf = (req, name) =>
  `${req.ip}|${String(name ?? "")
    .trim()
    .toLowerCase()}`;

function recent(key, now = Date.now()) {
  const list = (failures.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length) failures.set(key, list);
  else failures.delete(key);
  return list;
}

/** Seconds until the next attempt is allowed, or 0 when allowed now. */
function retryAfter(req, name) {
  const list = recent(keyOf(req, name));
  if (list.length < MAX_FAILURES) return 0;
  return Math.ceil((list[0] + WINDOW_MS - Date.now()) / 1000);
}

function recordFailure(req, name) {
  const key = keyOf(req, name);
  failures.set(key, [...recent(key), Date.now()]);
}

function reset(req, name) {
  failures.delete(keyOf(req, name));
}

// Drop stale entries now and then
setInterval(() => {
  for (const key of failures.keys()) recent(key);
}, WINDOW_MS).unref();

module.exports = { retryAfter, recordFailure, reset };
