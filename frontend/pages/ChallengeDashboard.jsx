import { useEffect, useState } from "react";
import axios from "axios";
import Navbar2 from "../src/components/Navbar2";
import { useNavigate } from "react-router-dom";

export default function ChallengeDashboard() {
    const [user, setUser] = useState(null);
    const [challenges, setChallenges] = useState([]);

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
                // https://cybersim-backend.onrender.com/api/ctf/levels
                const challengesRes = await axios.get("http://localhost:5000/api/challenges/levels",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setChallenges(challengesRes.data);
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
    
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => navigate(`/challenge/${challenge.name.toLowerCase().replace(" ", "-")}`)}
                  className={`cursor-pointer rounded-lg p-6 shadow-md text-white transition-transform hover:scale-105 ${
                    challenge.difficulty === "Easy"
                      ? "bg-gradient-to-br from-green-500 to-green-700"
                      : challenge.difficulty === "Medium"
                      ? "bg-gradient-to-br from-yellow-500 to-orange-600"
                      : "bg-gradient-to-br from-red-500 to-red-700"
                  }`}
                >
                  <h3 className="text-xl font-bold">{challenge.name}</h3>
                  <p className="text-sm mt-1 opacity-90">{challenge.difficulty}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }