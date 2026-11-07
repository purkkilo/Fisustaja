import axios from "axios";

const url = "api/cups/";

class CupService {
  static async getCups(query) {
    const res = await axios.get(`${url}`, { params: query });
    let cup = res.data;
    if (Array.isArray(cup)) {
      cup = dataToCup(cup);
    }
    return cup;
  }

  static insertCup(cup) {
    return axios.post(url, cup);
  }

  static updateCup(id, cup) {
    return axios.put(`${url}${id}/replace`, cup);
  }

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
