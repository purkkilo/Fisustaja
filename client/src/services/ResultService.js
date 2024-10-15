import axios from "axios";

const url = "api/results/";

class ResultService {
  // Get results with given query from api/results/
  /**
   *
   * @param {*} query
   * @returns
   */
  static async getResults(query) {
    const res = await axios.get(`${url}`, { params: query });
    try {
      let result = res.data;
      // Array, with multiple results
      if (typeof result == "object" && result.constructor === Array) {
        result = dataToResult(result);
      }
      // If it's not an array, just return res.data
      return result;
    } catch (err) {
      return err;
    }
  }

  // Create result
  /**
   *
   * @param {Array} results
   * @returns
   */
  static insertResults(results) {
    return axios.post(url, results);
  }

  // Update whole result
  /**
   *
   * @param {string} id
   * @param {*} result
   * @returns
   */
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

  // Update some values
  /**
   *
   * @param {string} id
   * @param {*} newvalues
   * @returns
   */
  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}/update`, newvalues);
  }

  /**
   *
   * @param {string} id
   * @returns
   */
  static deleteResult(id) {
    return axios.delete(`${url}${id}`);
  }
}

// ?
function dataToResult(data) {
  return data.map((result) => ({
    ...result,
    createdAt: new Date(result.createdAt),
  }));
}

export default ResultService;
