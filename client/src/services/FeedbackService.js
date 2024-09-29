import axios from "axios";

const url = "api/feedback/";

class FeedbackService {
  // Get competitions
  static async getFeedback(query) {
    const res = await axios.get(`${url}`, { params: query });
    try {
      let feedback = res.data;

      // Array, with multiple competitions
      if (typeof feedback == "object" && feedback.constructor === Array) {
        feedback = dataToFeedback(feedback);
      }
      // If it's not an array, just return res.data
      return feedback;
    } catch (err) {
      return err;
    }
  }

  // Create feedback
  static insertFeedback(feedback) {
    return axios.post(url, feedback);
  }

  static deleteFeedback(id) {
    return axios.delete(`${url}${id}`);
  }
}

function dataToFeedback(data) {
  return data.map((feedback) => ({
    ...feedback,
    createdAt: new Date(feedback.createdAt),
  }));
}

export default FeedbackService;
