const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cup Schema

const CupSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  signees: [Schema.Types.Mixed],
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Cup = mongoose.model("cup", CupSchema);
