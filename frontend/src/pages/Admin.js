
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Admin() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [party, setParty] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "admin") {
            navigate("/dashboard");
            return;
        }

        fetchCandidates();
    }, [navigate]);

    const fetchCandidates = async () => {
        try {
            const res = await API.get("/vote/candidates");
            setCandidates(res.data);
        } catch (err) {
            console.error(
                "Failed to fetch candidates:",
                err.response?.data || err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const addCandidate = async (e) => {
        e.preventDefault();

        if (!name || !party) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await API.post("/vote/candidates", { name, party });

            setName("");
            setParty("");

            await fetchCandidates();

            alert("Candidate added successfully");
        } catch (err) {
            console.error(
                "Add Candidate Error:",
                err.response?.data || err.message
            );
            alert(err.response?.data?.message || "Error adding candidate");
        }
    };

    const deleteCandidate = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this candidate?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/vote/candidates/${id}`);

            await fetchCandidates();
        } catch (err) {
            console.error(
                "Delete Candidate Error:",
                err.response?.data || err.message
            );
            alert("Delete failed");
        }
    };

    return (
        <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <Navbar />

            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto",
                    padding: "40px 20px",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        fontSize: "32px",
                        marginBottom: "10px",
                        color: "#1e293b",
                        fontWeight: "bold",
                    }}
                >
                    Admin Dashboard
                </h1>

                <p style={{ color: "#64748b", marginBottom: "30px" }}>
                    Manage candidates and control the voting system
                </p>

                {/* Add Candidate Form */}
                <form
                    onSubmit={addCandidate}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                >
                    <input
                        placeholder="Candidate Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            flex: 1,
                        }}
                    />

                    <input
                        placeholder="Party"
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            flex: 1,
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Add Candidate
                    </button>
                </form>

                <hr
                    style={{
                        margin: "40px 0",
                        border: "0",
                        borderTop: "1px solid #e2e8f0",
                    }}
                />

                <h2 style={{ color: "#334155", marginBottom: "20px" }}>
                    Candidate List
                </h2>

                {loading ? (
                    <p>Loading candidates...</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: "20px",
                            marginTop: "20px",
                        }}
                    >
                        {candidates.length > 0 ? (
                            candidates.map((c) => (
                                <div
                                    key={c._id}
                                    style={{
                                        backgroundColor: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>
                                        {c.name}
                                    </h3>

                                    <p
                                        style={{
                                            color: "#64748b",
                                            fontSize: "14px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        {c.party}
                                    </p>

                                    <button
                                        onClick={() => deleteCandidate(c._id)}
                                        style={{
                                            background: "#ef4444",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "6px",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p style={{ gridColumn: "1 / -1", color: "#94a3b8" }}>
                                No candidates found.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
