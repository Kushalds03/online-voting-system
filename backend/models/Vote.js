const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Vote", VoteSchema);