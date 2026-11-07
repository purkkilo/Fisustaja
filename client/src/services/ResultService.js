import axios from "axios";

const url = "api/results/";

class ResultService {
  static async getResults(query) {
    const res = await axios.get(`${url}`, { params: query });
    let result = res.data;
    if (Array.isArray(result)) {
      result = dataToResult(result);
    }
    return result;
  }

  static insertResults(results) {
    return axios.post(url, results);
  }

  static updateResult(id, result) {
    return axios.put(`${url}${id}/replace`, result);
  }

  static updateManyResults(ids, valueToSet) {
    return axios.put(`${url}update-many`, {
      ids: ids,
      valueToSet: valueToSet,
    });
  }

  static replaceManyResults(results) {
    return axios.put(`${url}replace-many`, results);
  }

  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}/update`, newvalues);
  }

  static deleteResult(id) {
    return axios.delete(`${url}${id}`);
  }
}

function dataToResult(data) {
  return data.map((result) => ({
    ...result,
    createdAt: new Date(result.createdAt),
  }));
}

export default ResultService;
