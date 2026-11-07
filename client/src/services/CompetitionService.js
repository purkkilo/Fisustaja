import axios from "./http";

const url = "api/competitions/";

function mapDates(competition) {
  return {
    ...competition,
    createdAt: competition.createdAt
      ? new Date(competition.createdAt)
      : competition.createdAt,
  };
}

class CompetitionService {
  /** List competitions matching query. Always returns an array. */
  static async list(query) {
    const res = await axios.get(url, { params: query });
    return (res.data || []).map(mapDates);
  }

  /** Fetch one competition by id. Throws on 404. */
  static async getById(id, extra = {}) {
    const res = await axios.get(url, { params: { _id: id, ...extra } });
    return mapDates(res.data);
  }

  /** @deprecated Prefer list() or getById() */
  static async getCompetitions(query = {}) {
    if (query._id) {
      const { _id, ...extra } = query;
      return this.getById(_id, extra);
    }
    return this.list(query);
  }

  /** Create competitions; returns created doc or array. */
  static async insertCompetitions(competitions) {
    const res = await axios.post(url, competitions);
    return res.data.data;
  }

  static async updateCompetition(id, competition) {
    await axios.put(`${url}${id}/replace`, competition);
  }

  static async updateValues(id, newvalues) {
    await axios.put(`${url}${id}/update`, newvalues);
  }

  static async replaceManyCompetitions(competitions) {
    await axios.put(`${url}replace-many`, competitions);
  }

  static async deleteCompetition(id) {
    await axios.delete(`${url}${id}`);
  }
}

export default CompetitionService;
