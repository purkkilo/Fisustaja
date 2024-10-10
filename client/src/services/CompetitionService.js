import axios from "axios";

const url = "api/competitions/";

class CompetitionService {
  // Get competitions with given query from api/competitions/
  static async getCompetitions(query) {
    const res = await axios.get(`${url}`, { params: query });
    try {
      let competition = res.data;
      // Array, with multiple competitions
      if (typeof competition == "object" && competition.constructor === Array) {
        competition = dataToCompetition(competition);
      }
      // If it's not an array, just return res.data
      return competition;
    } catch (err) {
      return err;
    }
  }

  // Create competition
  static insertCompetitions(competitions) {
    return axios.post(url, competitions);
  }

  // Update whole competition
  static updateCompetition(id, competition) {
    return axios.put(`${url}${id}/replace`, competition);
  }

  // Update some values
  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}/update`, newvalues);
  }

  static deleteCompetition(id) {
    return axios.delete(`${url}${id}`);
  }
}

function dataToCompetition(data) {
  return data.map((competition) => ({
    ...competition,
    createdAt: new Date(competition.createdAt),
  }));
}

export default CompetitionService;
