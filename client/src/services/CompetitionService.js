import axios from "axios";

const url = "api/competitions/";

class CompetitionService {
  static async getCompetitions(query) {
    const res = await axios.get(`${url}`, { params: query });
    let competition = res.data;
    if (Array.isArray(competition)) {
      competition = dataToCompetition(competition);
    }
    return competition;
  }

  static insertCompetitions(competitions) {
    return axios.post(url, competitions);
  }

  static updateCompetition(id, competition) {
    return axios.put(`${url}${id}/replace`, competition);
  }

  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}/update`, newvalues);
  }

  static replaceManyCompetitions(competitions) {
    return axios.put(`${url}replace-many`, competitions);
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
