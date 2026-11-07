/** Consistent JSON responses for domain routes. */

function ok(res, data, status = 200) {
  if (data === undefined) {
    return res.status(status).json({ success: true });
  }
  return res.status(status).json(data);
}

function created(res, data) {
  return res.status(201).json({ success: true, data });
}

function mutated(res) {
  return res.status(200).json({ success: true });
}

function fail(res, status, error) {
  return res.status(status).json({ success: false, error });
}

module.exports = { ok, created, mutated, fail };
