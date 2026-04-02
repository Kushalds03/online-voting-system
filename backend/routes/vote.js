const express = require("express");
const mongoose = require("mongoose");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ======================
// Get Candidates
// ======================
router.get("/candidates", async (req, res) => {
  try {

    const candidates = await Candidate.find().sort({ name: 1 });

    res.json(candidates);

  } catch (err) {

    console.error("Fetch Candidates Error:", err);
    res.status(500).json({ message: "Failed to fetch candidates" });

  }
});


// ======================
// Add Candidate (ADMIN)
// ======================
router.post("/candidates", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, party } = req.body;

    if (!name || !party) {
      return res.status(400).json({ message: "Name and party are required" });
    }

    const candidate = new Candidate({
      name,
      party
    });

    await candidate.save();

    const vote = new Vote({
      candidateId: candidate._id.toString(),
      votes: 0
    });

    await vote.save();

    res.json({ message: "Candidate added successfully" });

  } catch (err) {

    console.error("Add Candidate Error:", err);
    res.status(500).json({ message: "Failed to add candidate" });

  }

});


// ======================
// Delete Candidate
// ======================
router.delete("/candidates/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const candidateId = new mongoose.Types.ObjectId(req.params.id);

    await Candidate.findByIdAndDelete(candidateId);

    await Vote.findOneAndDelete({
      candidateId: candidateId.toString()
    });

    res.json({ message: "Candidate deleted successfully" });

  } catch (err) {

    console.error("Delete Candidate Error:", err);
    res.status(500).json({ message: "Failed to delete candidate" });

  }

});


// ======================
// Cast Vote
// ======================
router.post("/cast", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.id;
    const { candidate } = req.body;

    if (!candidate) {
      return res.status(400).json({ message: "Candidate is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: "You have already voted!" });
    }

    const existingCandidate = await Candidate.findById(candidate);

    if (!existingCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const candidateIdString = existingCandidate._id.toString();

    let vote = await Vote.findOne({
      candidateId: candidateIdString
    });

    if (!vote) {

      vote = new Vote({
        candidateId: candidateIdString,
        votes: 1
      });

    } else {

      vote.votes += 1;

    }

    await vote.save();

    user.hasVoted = true;
    await user.save();

    res.json({ message: "Vote cast successfully!" });

  } catch (err) {

    console.error("Vote Error:", err);
    res.status(500).json({ message: "Voting failed" });

  }

});


// ======================
// Get Results
// ======================
router.get("/results", authMiddleware, async (req, res) => {
  try {

    const candidates = await Candidate.find();
    const votes = await Vote.find();

    const totalVotes = votes.reduce((sum, v) => sum + v.votes, 0);

    const results = candidates.map(candidate => {

      const voteDoc = votes.find(
        v => v.candidateId === candidate._id.toString()
      );

      const voteCount = voteDoc ? voteDoc.votes : 0;

      const percentage =
        totalVotes === 0 ? 0 : ((voteCount / totalVotes) * 100).toFixed(2);

      return {
        _id: candidate._id,
        name: candidate.name,
        party: candidate.party,
        votes: voteCount,
        percentage
      };

    });

    res.json(results);

  } catch (err) {

    console.error("Results Error:", err);
    res.status(500).json({ message: "Failed to fetch results" });

  }
});

module.exports = router;