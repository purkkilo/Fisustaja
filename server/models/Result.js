const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Result Schema
/*
      boat_number: 4,
      captain_name: "test4",
      crew: ["t2", "t1"],
      fishes: [{"name": "Lohi", weight: 1},{"name": "Hauki", weight: 2}],
      competition_id: "665e652954728ad48eff6aa0",
      cup_id: "665e5f6354728ad48eff6a9b",
      createdAt: new Date(),
*/

const ResultSchema = new Schema({
  boat_number: {
    type: Number,
    required: true,
  },
  captain_name: {
    type: String,
    required: true,
  },
  temp_captain_name: {
    type: String,
    required: true,
  },
  crew: {
    type: [String],
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  fishes: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  competition_id: {
    type: String,
    required: true,
  },
  cup_id: {
    type: String,
  },
  returned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Result = mongoose.model("results", ResultSchema);
