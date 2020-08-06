import axios from "axios";

const url = "api/competitions/";

class CompetitionService {
  // Get all competitions
  static async getAllCompetitions() {
    const res = await axios.get(`${url}`);
    try {
      const data = res.data;
      return data.map((competition) => ({
        _id: competition._id,
        user_id: competition.user_id,
        cup_id: competition.cup_id,
        name: competition.name,
        locality: competition.locality,
        cup_name: competition.cup_name,
        cup_placement_points: competition.cup_placement_points,
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
        normal_points: competition.normal_points,
        normal_weights: competition.normal_weights,
        team_results: competition.team_results,
        team_competition: competition.team_competition,
        fish_stats: competition.fish_stats,
        biggest_fishes: competition.biggest_fishes,
        biggest_amounts: competition.biggest_amounts,
        isPublic: competition.isPublic,
      }));
    } catch (err) {
      return err;
    }
  }

  // Get all competitions
  static async getPublicCompetitions() {
    const res = await axios.get(`${url}/public`);
    try {
      const data = res.data;
      return data.map((competition) => ({
        _id: competition._id,
        user_id: competition.user_id,
        cup_id: competition.cup_id,
        name: competition.name,
        locality: competition.locality,
        cup_name: competition.cup_name,
        cup_placement_points: competition.cup_placement_points,
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
        normal_points: competition.normal_points,
        normal_weights: competition.normal_weights,
        team_results: competition.team_results,
        team_competition: competition.team_competition,
        fish_stats: competition.fish_stats,
        biggest_fishes: competition.biggest_fishes,
        biggest_amounts: competition.biggest_amounts,
        isPublic: competition.isPublic,
      }));
    } catch (err) {
      return err;
    }
  }

  // Get user's competitions
  static async getCompetitions(user_id) {
    const res = await axios.get(`${url}${user_id}`);
    try {
      const data = res.data;
      return data.map((competition) => ({
        _id: competition._id,
        user_id: competition.user_id,
        cup_id: competition.cup_id,
        name: competition.name,
        locality: competition.locality,
        cup_name: competition.cup_name,
        cup_placement_points: competition.cup_placement_points,
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
        normal_points: competition.normal_points,
        normal_weights: competition.normal_weights,
        team_results: competition.team_results,
        team_competition: competition.team_competition,
        fish_stats: competition.fish_stats,
        biggest_fishes: competition.biggest_fishes,
        biggest_amounts: competition.biggest_amounts,
        isPublic: competition.isPublic,
      }));
    } catch (err) {
      return err;
    }
  }

  // Get all competitions in cup
  static async getCupCompetitions(cup_id) {
    const res = await axios.get(`${url}cup/${cup_id}`);
    try {
      const data = res.data;
      return data.map((competition) => ({
        _id: competition._id,
        user_id: competition.user_id,
        cup_id: competition.cup_id,
        name: competition.name,
        locality: competition.locality,
        cup_name: competition.cup_name,
        cup_placement_points: competition.cup_placement_points,
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
        normal_points: competition.normal_points,
        normal_weights: competition.normal_weights,
        team_results: competition.team_results,
        team_competition: competition.team_competition,
        fish_stats: competition.fish_stats,
        biggest_fishes: competition.biggest_fishes,
        biggest_amounts: competition.biggest_amounts,
        isPublic: competition.isPublic,
      }));
    } catch (err) {
      return err;
    }
  }

  // Get competitions
  static async getCompetition(competition_id) {
    const res = await axios.get(`${url}competition/${competition_id}`);
    try {
      const data = res.data;
      return data.map((competition) => ({
        _id: competition._id,
        user_id: competition.user_id,
        cup_id: competition.cup_id,
        name: competition.name,
        locality: competition.locality,
        cup_name: competition.cup_name,
        cup_placement_points: competition.cup_placement_points,
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
        fish_stats: competition.fish_stats,
        biggest_fishes: competition.biggest_fishes,
        biggest_amounts: competition.biggest_amounts,
        isPublic: competition.isPublic,
      }));
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
      fish_stats: [],
      team_competition: competition.team_competition,
      biggest_fishes: competition.biggest_fishes,
      biggest_amounts: competition.biggest_amounts,
      isPublic: competition.isPublic,
    });
  }

  static updateCompetition(id, competition) {
    return axios.put(`${url}${id}`, competition);
  }

  static deleteCompetition(id) {
    return axios.delete(`${url}${id}`);
  }
}

export default CompetitionService;
