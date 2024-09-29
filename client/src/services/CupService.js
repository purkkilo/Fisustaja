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
    return axios.post(url, cup);
  }

  // Update whole cup
  static updateCup(id, cup) {
    return axios.put(`${url}${id}/replace`, cup);
  }

  // Update some values
  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}/update`, newvalues);
  }

  static deleteCup(id) {
    return axios.delete(`${url}${id}`);
  }
}

function dataToCup(data) {
  return data.map((cup) => ({
    ...cup,
    createdAt: new Date(cup.createdAt),
  }));
}

export default CupService;
