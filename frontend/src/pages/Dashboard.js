import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {

  const navigate = useNavigate();

  const [user,setUser] = useState(null);
  const [hasVoted,setHasVoted] = useState(false);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    getUser();

  },[]);


  const getUser = async()=>{

    try{

      const res = await API.get("/auth/me");

      setUser(res.data);

      setHasVoted(res.data.voted);

    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);

    }

  };


  if(loading){

    return <div style={{textAlign:"center"}}>Loading...</div>

  }


  return(

    <div>

      <Navbar/>

      <div style={{
        maxWidth:"1000px",
        margin:"40px auto",
        textAlign:"center"
      }}>

        <h1>Online Voting Dashboard</h1>

        {user && (

          <p style={{marginTop:"10px"}}>

            Welcome <b>{user.name}</b>

          </p>

        )}

        <div style={{
          display:"flex",
          justifyContent:"center",
          gap:"25px",
          marginTop:"40px",
          flexWrap:"wrap"
        }}>


          {/* Vote Card */}

          <div style={{
            border:"1px solid #ddd",
            padding:"30px",
            width:"250px",
            borderRadius:"10px",
            background:"#ffffff",
            boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
          }}>

            <h3>Vote</h3>

            <p>Cast your vote for your preferred candidate.</p>

            <button
              style={{
                padding:"10px 20px",
                background: hasVoted ? "#aaa" : "#2563eb",
                color:"white",
                border:"none",
                borderRadius:"5px",
                cursor: hasVoted ? "not-allowed" : "pointer"
              }}
              disabled={hasVoted}
              onClick={()=>navigate("/vote")}
            >
              {hasVoted ? "Already Voted" : "Go Vote"}
            </button>

          </div>


          {/* Results Card */}

          <div style={{
            border:"1px solid #ddd",
            padding:"30px",
            width:"250px",
            borderRadius:"10px",
            background:"#ffffff",
            boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
          }}>

            <h3>Results</h3>

            <p>View the current election results.</p>

            <button
              style={{
                padding:"10px 20px",
                background:"#16a34a",
                color:"white",
                border:"none",
                borderRadius:"5px",
                cursor:"pointer"
              }}
              onClick={()=>navigate("/results")}
            >
              View Results
            </button>

          </div>


          {/* Admin Panel */}

          <div style={{
            border:"1px solid #ddd",
            padding:"30px",
            width:"250px",
            borderRadius:"10px",
            background:"#ffffff",
            boxShadow:"0 4px 10px rgba(0,0,0,0.1)"
          }}>

            <h3>Admin Panel</h3>

            <p>Manage candidates and election settings.</p>

            <button
              style={{
                padding:"10px 20px",
                background:"#f97316",
                color:"white",
                border:"none",
                borderRadius:"5px",
                cursor:"pointer"
              }}
              onClick={()=>navigate("/admin")}
            >
              Open Admin
            </button>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard