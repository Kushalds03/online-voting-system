const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true   // 🔥 prevents duplicate votes at DB level
  },
  candidate: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Vote", voteSchema);