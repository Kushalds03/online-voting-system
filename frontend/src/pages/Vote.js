import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CandidateCard from "../components/CandidateCard";
import API from "../services/api";

function Vote() {

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {

        try {

            const res = await API.get("/vote/candidates");
            setCandidates(res.data);

        } catch (err) {

            console.log("Error fetching candidates:", err);

        } finally {

            setLoading(false);

        }

    };

    const voteCandidate = async (id) => {

        console.log("Voting for candidate:", id);

        try {

            const res = await API.post("/vote/cast", {
                candidate: id
            });

            alert(res.data.message);

        } catch (err) {

            console.log("Vote Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Voting failed");

        }

    };

    return (

        <div>

            <Navbar />

            <h1 style={{ textAlign: "center", marginTop: "20px" }}>
                Cast Your Vote
            </h1>

            {loading ? (

                <p style={{ textAlign: "center" }}>
                    Loading candidates...
                </p>

            ) : (

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginTop: "30px"
                    }}
                >

                    {candidates.map((c) => (
                        <CandidateCard
                            key={c._id}
                            candidate={c}
                            onVote={voteCandidate}
                        />
                    ))}

                </div>

            )}

        </div>

    );

}

export default Vote;