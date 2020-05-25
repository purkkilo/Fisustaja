import axios from 'axios';

//todo, other services
const url = "api/competitions/";

class CompetitionService {
    // Get competitions
    static async getCompetitions() {
        const res = await axios.get(url);
        try {
          const data = res.data
          return data.map(competition => ({
            _id: competition._id,
            competition_name: competition.competition_name,
            cup_name:  competition.cup_name,
            cup_multiplier: competition.cup_multiplier,
            date_of_competition: competition.date_of_competition,
            start_of_competition: competition.start_of_competition,
            end_of_competition: competition.end_of_competition,
            fishes: competition.fishes,
            state: competition.state,
            createdAt: new Date(competition.createdAt)
          }))
        } catch (err) {
          return err
        }
    }

    // Create competition
    static insertCompetition(competition) {
        return axios.post(url, {
            competition_name: competition.competition_name,
            cup_name:  competition.cup_name,
            cup_multiplier: competition.cup_multiplier,
            date_of_competition: competition.date_of_competition,
            start_of_competition: competition.start_of_competition,
            end_of_competition: competition.end_of_competition,
            fishes: competition.fishes,
            state: "Rekisteröity",
            createdAt: competition.createdAt
        });
    }

    // Delete competition
    static deleteCompetition(id) {
        return axios.delete(`${url}${id}`);
    }

}


export default CompetitionService;