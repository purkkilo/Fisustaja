import axios from 'axios';

const url = "api/feedback/";

class FeedbackService {
    // Get competitions
    static async getFeedback() {
        const res = await axios.get(url);
        try {
          const data = res.data
          return data.map(feedback => ({
            _id: feedback._id,
            type: feedback.type,
            message: feedback.message,
            createdAt: new Date(feedback.createdAt),
          }))
        } catch (err) {
          return err
        }
    }

    // Create feedback
    static insertFeedback(feedback) {
        return axios.post(url, {
            type: feedback.type,
            message: feedback.message,
        });
    }

    static deleteFeedback(id) {
        return axios.delete(`${url}${id}`);
    }

}

export default FeedbackService;