const express = require("express");
const Vote = require("../models/Vote");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Cast Vote
router.post("/cast", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { candidate } = req.body;

    const user = await User.findById(userId);

    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted!" });
    }

    const vote = new Vote({
      userId,
      candidate
    });

    await vote.save();

    user.hasVoted = true;
    await user.save();

    res.json({ message: "Vote cast successfully!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;