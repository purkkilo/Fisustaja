const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Competition Schema

const CompetitionSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  cup_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  cup_name: {
    type: String,
    required: true,
  },
  cup_placement_points: {
    type: Number,
    default: 30,
  },
  cup_placement_points_array: {
    type: [Number],
  },
  cup_participation_points: {
    type: Number,
    default: 5,
  },
  cup_points_multiplier: {
    type: Number,
    default: 1,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  total_weights: {
    type: Number,
    default: 0,
  },
  fishes: [Schema.Types.Mixed],
  state: {
    type: String,
    default: "Rekisteröity",
  },
  signees: [Schema.Types.Mixed],
  teams: [Schema.Types.Mixed],
  normal_points: [Schema.Types.Mixed],
  normal_weights: [Schema.Types.Mixed],
  team_results: [Schema.Types.Mixed],
  team_competition: {
    type: Boolean,
    default: false,
  },
  biggest_fishes: {
    type: Schema.Types.Mixed,
    required: true,
  },
  biggest_amounts: {
    type: Schema.Types.Mixed,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Competition = mongoose.model("competition", CompetitionSchema);
