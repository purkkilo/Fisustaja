const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Feedback Schema

const FeedbackSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = Feedback = mongoose.model("feedback", FeedbackSchema);
