function CandidateCard({ candidate, onVote }) {

  return (

    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        margin: "12px",
        width: "230px",
        background: "#ffffff",
        boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}
    >

      <h3 style={{
        margin: "0 0 8px 0",
        color: "#1f2937",
        fontSize: "1.25rem"
      }}>
        {candidate.name}
      </h3>

      <p style={{
        margin: "0 0 20px 0",
        color: "#6b7280",
        fontSize: "0.95rem"
      }}>
        Party: <strong>{candidate.party}</strong>
      </p>

      <button
        type="button"
        onClick={() => onVote(candidate._id)}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        Vote
      </button>

    </div>

  );

}

export default CandidateCard;