import axios from "axios";

const url = "api/cups/";

class CupService {
  // Get cup(s) with given query
  static async getCups(query) {
    const res = await axios.get(`${url}`, { params: query });
    try {
      const data = res.data;
      return dataToCup(data);
    } catch (err) {
      return err;
    }
  }

  // Create cup
  static insertCup(cup) {
    return axios.post(url, {
      user_id: cup.user_id,
      name: cup.name,
      year: cup.year,
      signees: [],
      isPublic: false,
    });
  }

  static updateCup(id, cup) {
    return axios.put(`${url}${id}`, cup);
  }

  static deleteCup(id) {
    return axios.delete(`${url}${id}`);
  }
}

function dataToCup(data) {
  return data.map((cup) => ({
    id: cup._id,
    user_id: cup.user_id,
    name: cup.name,
    year: cup.year,
    signees: cup.signees,
    isPublic: cup.isPublic,
    createdAt: new Date(cup.createdAt),
  }));
}

export default CupService;
