import axios from "./http";

const url = "api/results/";

function mapDates(result) {
  return {
    ...result,
    createdAt: result.createdAt
      ? new Date(result.createdAt)
      : result.createdAt,
  };
}

class ResultService {
  /** List results matching query. Always returns an array. */
  static async list(query) {
    const res = await axios.get(url, { params: query });
    return (res.data || []).map(mapDates);
  }

  /** Fetch one result by id. Throws on 404. */
  static async getById(id, extra = {}) {
    const res = await axios.get(url, { params: { _id: id, ...extra } });
    return mapDates(res.data);
  }

  /** @deprecated Prefer list() or getById() */
  static async getResults(query = {}) {
    if (query._id) {
      const { _id, ...extra } = query;
      return this.getById(_id, extra);
    }
    return this.list(query);
  }

  /** Create results; returns created doc or array. */
  static async insertResults(results) {
    const res = await axios.post(url, results);
    return res.data.data;
  }

  static async updateResult(id, result) {
    await axios.put(`${url}${id}/replace`, result);
  }

  static async updateManyResults(ids, valueToSet) {
    await axios.put(`${url}update-many`, {
      ids,
      valueToSet,
    });
  }

  static async replaceManyResults(results) {
    await axios.put(`${url}replace-many`, results);
  }

  static async updateValues(id, newvalues) {
    await axios.put(`${url}${id}/update`, newvalues);
  }

  static async deleteResult(id) {
    await axios.delete(`${url}${id}`);
  }
}

export default ResultService;
