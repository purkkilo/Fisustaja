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
    type: [Schema.Types.Mixed],
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
  fishes: [Schema.Types.Mixed],
  state: {
    type: String,
    default: "Rekisteröity",
  },
  team_competition: {
    type: Boolean,
    default: false,
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

module.exports = Competition = mongoose.model(
  "competitions",
  CompetitionSchema
);
