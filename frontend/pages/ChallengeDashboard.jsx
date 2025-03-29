import { useEffect, useState } from "react";
import axios from "axios";
import Navbar2 from "../src/components/Navbar2";
import { useNavigate } from "react-router-dom";

export default function ChallengeDashboard() {
    const [user, setUser] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
         console.log("TOKEN:", token); // 👈 add this
        if (!token) return;

        const fetchData = async () => {
            try {
                // https://cybersim-backend.onrender.com/api/auth/profile
                const userRes = await axios.get("http://localhost:5000/api/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setUser(userRes.data.user);
                // https://cybersim-backend.onrender.com/api/challenges/levels
                const challengesRes = await axios.get("http://localhost:5000/api/challenges/levels",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setChallenges(challengesRes.data);
                setLoading(false);
                console.log("Fetched challenges:", challenges);
            } catch (err) {
                console.error("Error fetching dashboard", err);
            }
        };

        fetchData();
    }, []);

    

    return (
      <>
        <Navbar2 />
        <div className="pt-24 px-6 min-h-screen bg-gray-950 text-white">
          {user && (
            <h1 className="text-3xl font-bold mb-4">Hey {user.username} 👋</h1>
          )}
    
          {user && (
            <div className="mb-6">
              <p className="text-lg">
                🏆 <span className="font-semibold">Score:</span> {user.score}
              </p>
            </div>
          )}
    
          <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
    
          {/* Loading message */}
          {loading ? (
            <p className="text-center text-gray-400 mt-12">Loading challenges...</p>
          ) : challenges.length === 0 ? (
            <p className="text-center text-red-400 mt-12">No challenges found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <div
                  key={challenge.id}
                  onClick={() => {
                    if (challenge.completed || index === 0) {
                      navigate(`/challenge/${challenge.name.toLowerCase().replace(/\s+/g, "-")}`);
                    }
                  }}
                  className={`cursor-pointer rounded-lg p-6 shadow-md text-white transition-transform hover:scale-105 ${
                    !(challenge.completed || index === 0) ? "opacity-50 pointer-events-none" : ""
                  } ${
                    challenge.difficulty === "Easy"
                      ? "bg-gradient-to-br from-green-500 to-green-700"
                      : challenge.difficulty === "Medium"
                      ? "bg-gradient-to-br from-yellow-500 to-orange-600"
                      : "bg-gradient-to-br from-red-500 to-red-700"
                  }`}
                >
                  <h3 className="text-xl font-bold">{challenge.name}</h3>
                  <p className="text-sm mt-1 opacity-90">{challenge.difficulty}</p>
                  {index === 0 && (
                    <span className="inline-block mt-3 text-xs font-semibold bg-white text-black px-3 py-1 rounded-full shadow">
                      🚀 Start Here
                    </span>
                  )}
                  <p className="text-sm mt-2">
                    {(challenge.completed || index === 0) ? "✅ Completed" : "🔒 Locked"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );    
}