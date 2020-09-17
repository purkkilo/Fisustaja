import axios from "axios";

const url = "api/cups/";

class CupService {
  // Get cup(s) with given query
  static async getCups(query) {
    const res = await axios.get(`${url}`, { params: query });
    try {
      let cup = res.data;
      if (typeof cup == "object" && cup.constructor === Array) {
        cup = dataToCup(cup);
      }
      return cup;
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

  // Update whole cup
  static updateCup(id, cup) {
    return axios.put(`${url}${id}`, cup);
  }

  // Update some values
  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}`, newvalues);
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
