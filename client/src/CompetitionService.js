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
  static insertCompetition(competition) {
    return axios.post(url, {
      ...competition,
      normal_points: [],
      normal_weights: [],
      team_results: [],
      isPublic: false,
      isFinished: false,
    });
  }

  // Update whole competition
  static updateCompetition(id, competition) {
    return axios.put(`${url}${id}`, competition);
  }

  // Update some values
  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}`, newvalues);
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
