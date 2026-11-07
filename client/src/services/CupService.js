import axios from "./http";

const url = "api/cups/";

function mapDates(cup) {
  return {
    ...cup,
    createdAt: cup.createdAt ? new Date(cup.createdAt) : cup.createdAt,
  };
}

class CupService {
  /** List cups matching query. Always returns an array. */
  static async list(query) {
    const res = await axios.get(url, { params: query });
    return (res.data || []).map(mapDates);
  }

  /** Fetch one cup by id. Throws on 404. */
  static async getById(id, extra = {}) {
    const res = await axios.get(url, { params: { _id: id, ...extra } });
    return mapDates(res.data);
  }

  /** @deprecated Prefer list() or getById() */
  static async getCups(query = {}) {
    if (query._id) {
      const { _id, ...extra } = query;
      return this.getById(_id, extra);
    }
    return this.list(query);
  }

  /** Create cups; returns created doc or array. */
  static async insertCup(cup) {
    const res = await axios.post(url, cup);
    return res.data.data;
  }

  static async updateCup(id, cup) {
    await axios.put(`${url}${id}/replace`, cup);
  }

  static async updateValues(id, newvalues) {
    await axios.put(`${url}${id}/update`, newvalues);
  }

  static async deleteCup(id) {
    await axios.delete(`${url}${id}`);
  }
}

export default CupService;
