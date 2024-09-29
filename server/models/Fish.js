const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Fish Schema
/*
      boat_number: 4,
      captain_name: "test4",
      name: "Lohi",
      weight: 100,
      competition_id: "665e652954728ad48eff6aa0",
      cup_id: "665e5f6354728ad48eff6a9b",
      createdAt: new Date(),
*/

const FishSchema = new Schema({
  fish_id: {
    type: Number,
    required: true,
  },
  boat_number: {
    type: Number,
    required: true,
  },
  captain_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  competition_id: {
    type: String,
    required: true,
  },
  cup_id: {
    type: String,
    required: true,
    default: "-",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Fish = mongoose.model("fishes", FishSchema);
