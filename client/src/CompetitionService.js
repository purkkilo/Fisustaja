import axios from 'axios';

const url = "api/competitions/";

class CompetitionService {
    // Get competitions
    static async getCompetitions(user_id) {
        const res = await axios.get(`${url}${user_id}`);
        try {
          const data = res.data
          return data.map(competition => ({
            _id: competition._id,
            competition_id: competition.competition_id,
            user_id: competition.user_id,
            name: competition.name,
            cup_name:  competition.cup_name,
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
            results: competition.results,
            teams: competition.teams,
            team_competition: competition.team_competition,
            biggest_fishes: competition.biggest_fishes,
            biggest_amounts: competition.biggest_amounts,
          }))
        } catch (err) {
          return err
        }
    }

    // Get competitions
    static async getCompetition(competition_id) {
      const res = await axios.get(`${url}competition/${competition_id}`);
      try {
        const data = res.data
        return data.map(competition => ({
          _id: competition._id,
          competition_id: competition.competition_id,
          user_id: competition.user_id,
          name: competition.name,
          cup_name:  competition.cup_name,
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
          results: competition.results,
          teams: competition.teams,
          team_competition: competition.team_competition,
          biggest_fishes: competition.biggest_fishes,
          biggest_amounts: competition.biggest_amounts,
        }))
      } catch (err) {
        return err
      }
  }

    // Create competition
    static insertCompetition(competition) {
        return axios.post(url, {
            competition_id: competition.competition_id,
            user_id: competition.user_id,
            name: competition.name,
            cup_name:  competition.cup_name,
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
            results: competition.results,
            teams: competition.teams,
            team_competition: competition.team_competition,
            biggest_fishes: competition.biggest_fishes,
            biggest_amounts: competition.biggest_amounts,
        });
    }

    static updateCompetition(id, competition) {
      return axios.put(`${url}${id}`, competition);
    }

    // TODO Delete this when deployed
    static deleteCompetition(id) {
        return axios.delete(`${url}${id}`);
    }

}

export default CompetitionService;