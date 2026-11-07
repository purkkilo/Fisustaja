import axios from "axios";

const url = "api/fishes/";

class FishService {
  static async getFishes(query) {
    const res = await axios.get(`${url}`, { params: query });
    let fish = res.data;
    if (Array.isArray(fish)) {
      fish = dataToFish(fish);
    }
    return fish;
  }

  static insertFishes(fishes) {
    return axios.post(url, fishes);
  }

  static updateFish(id, fish) {
    return axios.put(`${url}${id}/replace`, fish);
  }

  static updateValues(id, newvalues) {
    return axios.put(`${url}${id}/update`, newvalues);
  }

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
