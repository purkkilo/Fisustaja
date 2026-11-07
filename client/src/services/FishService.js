import axios from "./http";

const url = "api/fishes/";

function mapDates(fish) {
  return {
    ...fish,
    createdAt: fish.createdAt ? new Date(fish.createdAt) : fish.createdAt,
  };
}

class FishService {
  /** List fishes matching query. Always returns an array. */
  static async list(query) {
    const res = await axios.get(url, { params: query });
    return (res.data || []).map(mapDates);
  }

  /** Fetch one fish by id. Throws on 404. */
  static async getById(id, extra = {}) {
    const res = await axios.get(url, { params: { _id: id, ...extra } });
    return mapDates(res.data);
  }

  /** @deprecated Prefer list() or getById() */
  static async getFishes(query = {}) {
    if (query._id) {
      const { _id, ...extra } = query;
      return this.getById(_id, extra);
    }
    return this.list(query);
  }

  /** Create fishes; returns created doc or array. */
  static async insertFishes(fishes) {
    const res = await axios.post(url, fishes);
    return res.data.data;
  }

  static async updateFish(id, fish) {
    await axios.put(`${url}${id}/replace`, fish);
  }

  static async updateValues(id, newvalues) {
    await axios.put(`${url}${id}/update`, newvalues);
  }

  static async deleteFish(id) {
    await axios.delete(`${url}${id}`);
  }
}

export default FishService;
