import axios from 'axios';

const url = "api/competitions/";

class CompetitionService {
    // Get competitions
    static async getCompetitions() {
        const res = await axios.get(url);
        try {
          const data = res.data
          return data.map(competition => ({
            _id: competition._id,
            competition_id: competition.competition_id,
            competition_name: competition.competition_name,
            cup_name:  competition.cup_name,
            cup_placement_points: competition.cup_placement_points,
            cup_participation_points: competition.cup_participation_points,
            cup_points_multiplier: competition.cup_points_multiplier,
            date_of_competition: competition.date_of_competition,
            competition_duration: competition.competition_duration,
            start_of_competition: competition.start_of_competition,
            end_of_competition: competition.end_of_competition,
            total_weights: competition.total_weights,
            fishes: competition.fishes,
            state: competition.state,
            createdAt: new Date(competition.createdAt),
            signees: competition.signees,
            results: competition.results,
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
            competition_name: competition.competition_name,
            cup_name:  competition.cup_name,
            cup_placement_points: competition.cup_placement_points,
            cup_participation_points: competition.cup_participation_points,
            cup_points_multiplier: competition.cup_points_multiplier,
            date_of_competition: competition.date_of_competition,
            competition_duration: competition.competition_duration,
            start_of_competition: competition.start_of_competition,
            end_of_competition: competition.end_of_competition,
            fishes: competition.fishes,
            state: competition.state,
            signees: competition.signees,
            results: competition.results,
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