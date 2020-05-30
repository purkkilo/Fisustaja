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
            cup_points_multiplier: competition.cup_points_multiplier,
            date_of_competition: competition.date_of_competition,
            start_of_competition: competition.start_of_competition,
            end_of_competition: competition.end_of_competition,
            total_weights: competition.total_weights,
            fishes: competition.fishes,
            state: competition.state,
            createdAt: new Date(competition.createdAt),
            signees: competition.signees,
            results: competition.results
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
            cup_points_multiplier: competition.cup_points_multiplier,
            date_of_competition: competition.date_of_competition,
            start_of_competition: competition.start_of_competition,
            end_of_competition: competition.end_of_competition,
            fishes: competition.fishes,
            state: "Rekisteröity",
            signees: competition.signees,
            results: competition.results,
        });
    }


    static updateCompetition(id, updatedSigneees) {
      return axios.put(`${url}${id}`, updatedSigneees);
    }


    // TODO Delete this when deployed
    static deleteCompetition(id) {
        return axios.delete(`${url}${id}`);
    }

}


export default CompetitionService;