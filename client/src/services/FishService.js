import axios from "axios";

const url = "api/fishes/";

class FishService {
  // Get fishes with given query from api/fishes/
  /**
   *
   * @param {*} query
   * @returns
   */
  static async getFishes(query) {
    const res = await axios.get(`${url}`, { params: query });
    try {
      let fish = res.data;
      // Array, with multiple fishes
      if (typeof fish == "object" && fish.constructor === Array) {
        fish = dataToFish(fish);
      }
      // If it's not an array, just return res.data
      return fish;
    } catch (err) {
      return err;
    }
  }

  // Create fish
  /**
   *
   * @param {Array} fishes
   * @returns
   */
  static insertFishes(fishes) {
    return axios.post(url, fishes);
  }
  // Update whole fish
  /**
   *
   * @param {string} id
   * @param {*} fish
   * @returns
   */
  static updateFish(id, fish) {
    return axios.put(`${url}${id}/replace`, fish);
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
  static deleteFish(id) {
    return axios.delete(`${url}${id}`);
  }
}

function dataToFish(data) {
  return data.map((fish) => ({
    ...fish,
    createdAt: new Date(fish.createdAt),
  }));
}

export default FishService;
