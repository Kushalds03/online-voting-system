import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = useCallback(async () => {
    try {
      const res = await API.get("/vote/results");
      // Sort by votes descending
      const sorted = Array.isArray(res.data)
        ? res.data.sort((a, b) => b.votes - a.votes)
        : [];
      setResults(sorted);
      setError("");
    } catch (err) {
      console.error("Fetch Results Error:", err);
      setError(err.response?.data?.message || "Failed to load election results");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();

    // Optional: Refresh results every 10 seconds for real-time feel
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  // Calculate total votes for accurate percentage share
  const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#1e293b", marginBottom: "10px" }}>
            Election Results
          </h1>
          <p style={{ color: "#64748b" }}>
            Live updates on the current standings
          </p>
        </header>

        {loading && results.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading live results...</p>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "20px", background: "#fef2f2", color: "#dc2626", borderRadius: "8px" }}>
            {error}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {results.length > 0 ? (
              results.map((candidate, index) => {
                const percent = totalVotes === 0
                  ? 0
                  : ((candidate.votes / totalVotes) * 100).toFixed(1);

                const isWinner = index === 0 && candidate.votes > 0;

                return (
                  <div
                    key={candidate._id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      border: isWinner ? "2px solid #22c55e" : "1px solid #e2e8f0",
                      position: "relative",
                      transition: "transform 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                          {candidate.name} {isWinner && "🏆"}
                        </h2>
                        <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                          {candidate.party}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "24px", fontWeight: "800", color: "#2563eb" }}>
                          {candidate.votes}
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase" }}>
                          Votes
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div style={{
                      backgroundColor: "#f1f5f9",
                      borderRadius: "999px",
                      height: "12px",
                      width: "100%",
                      overflow: "hidden",
                      marginTop: "15px"
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        backgroundColor: isWinner ? "#22c55e" : "#2563eb",
                        height: "100%",
                        borderRadius: "999px",
                        transition: "width 0.8s ease-out"
                      }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                      <p style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>
                        {percent}% of total votes
                      </p>
                      {isWinner && (
                        <span style={{ fontSize: "12px", color: "#15803d", background: "#dcfce7", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold" }}>
                          Leading
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>
                No votes have been cast yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;