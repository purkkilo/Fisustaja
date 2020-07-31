import axios from 'axios';

const url = "api/cups/";

class CupService {
    // Get cups
    static async getAllCups() {
        const res = await axios.get(url);
        try {
          const data = res.data
          return data.map(cup => ({
            id: cup._id,
            name: cup.name,
            year: cup.year,
            createdAt: new Date(cup.createdAt)
          }))
        } catch (err) {
          return err
        }
    }

    // Get user's cup
    static async getCups(user_id) {
      const res = await axios.get(`${url}${user_id}`);
      try {
        const data = res.data
        return data.map(cup => ({
          _id: cup._id,
          user_id: cup.user_id,
          name: cup.name,
          year: cup.year,
          createdAt: new Date(cup.createdAt),
        }))
      } catch (err) {
        return err
      }
  }

    // Get Cup
    static async getCup(cup_id) {
        const res = await axios.get(`${url}cup/${cup_id}`);
        try {
          const data = res.data
          return data.map(cup => ({
            id: cup._id,
            user_id: cup.user_id,
            name: cup.name,
            year: cup.year,
            createdAt: new Date(cup.createdAt)
          }))
        } catch (err) {
          return err
        }
    }

    // Create cup
    static insertCup(cup) {
        return axios.post(url, {
            user_id: cup.user_id,
            name: cup.name,
            year: cup.year,
        });
    }

    static deleteCup(id) {
        return axios.delete(`${url}${id}`);
    }

}
export default CupService;