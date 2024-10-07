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
  },
  cup_placement_points: {
    type: [Schema.Types.Mixed],
  },
  cup_participation_points: {
    type: Number,
  },
  cup_points_multiplier: {
    type: Number,
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
  teams: [Schema.Types.Mixed],
  state: {
    type: String,
    default: "Rekisteröity",
  },
  isTeamCompetition: {
    type: Boolean,
    default: false,
  },
  isCupCompetition: {
    type: Boolean,
    default: true,
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
