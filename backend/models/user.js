const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  hasVoted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("User", UserSchema);