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
      user_id: competition.user_id,
      cup_id: competition.cup_id,
      name: competition.name,
      locality: competition.locality,
      cup_name: competition.cup_name,
      cup_placement_points: competition.cup_placement_points,
      cup_placement_points_array: competition.cup_placement_points_array,
      cup_participation_points: competition.cup_participation_points,
      cup_points_multiplier: competition.cup_points_multiplier,
      start_date: competition.start_date,
      end_date: competition.end_date,
      start_time: competition.start_time,
      end_time: competition.end_time,
      fishes: competition.fishes,
      state: competition.state,
      signees: competition.signees,
      teams: competition.teams,
      normal_points: [],
      normal_weights: [],
      team_results: [],
      team_competition: competition.team_competition,
      biggest_fishes: competition.biggest_fishes,
      biggest_amounts: competition.biggest_amounts,
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
    _id: competition._id,
    user_id: competition.user_id,
    cup_id: competition.cup_id,
    name: competition.name,
    locality: competition.locality,
    cup_name: competition.cup_name,
    cup_placement_points: competition.cup_placement_points,
    cup_placement_points_array: competition.cup_placement_points_array,
    cup_participation_points: competition.cup_participation_points,
    cup_points_multiplier: competition.cup_points_multiplier,
    start_date: competition.start_date,
    end_date: competition.end_date,
    start_time: competition.start_time,
    end_time: competition.end_time,
    total_weights: competition.total_weights,
    fishes: competition.fishes,
    state: competition.state,
    createdAt: new Date(competition.createdAt),
    signees: competition.signees,
    teams: competition.teams,
    team_competition: competition.team_competition,
    normal_points: competition.normal_points,
    normal_weights: competition.normal_weights,
    team_results: competition.team_results,
    biggest_fishes: competition.biggest_fishes,
    biggest_amounts: competition.biggest_amounts,
    isPublic: competition.isPublic,
    isFinished: competition.isFinished,
  }));
}

export default CompetitionService;
