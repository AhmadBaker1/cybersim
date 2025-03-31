import { useEffect, useState } from "react";
import axios from "axios";
import Navbar2 from "../src/components/Navbar2";
import { useNavigate } from "react-router-dom";
import MatrixRain from "../src/components/MatrixRain";
import ChallengeCard from "../src/components/ChallengeCard";
import Leaderboard from "../src/components/Leaderboard";
import ChallengeNavbar from "../src/components/ChallengeNavbar";
import { API_BASE_URL } from "../src/config.js";


export default function ChallengeDashboard() {
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      console.warn("⚠️ Invalid or missing token. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userRes.data.user);

        const challengesRes = await axios.get(`${API_BASE_URL}/api/challenges/levels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChallenges(challengesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard", err);
      }
    };

    fetchData();
  }, []);

  function useAnimatedScore(finalScore) {
    const [animatedScore, setAnimatedScore] = useState(0);
  
    useEffect(() => {
      let current = 0;
      const interval = setInterval(() => {
        if (current >= finalScore) {
          clearInterval(interval);
        } else {
          current += Math.ceil((finalScore - current) / 10);
          setAnimatedScore(current);
        }
      }, 30);
      return () => clearInterval(interval);
    }, [finalScore]);
  
    return animatedScore;
  }

  const animatedScore = useAnimatedScore(user?.score || 0);

  return (
    <>
      <MatrixRain />
      <ChallengeNavbar />
      <div className="pt-24 px-6 min-h-screen bg-gray-950 text-white font-mono">
        {user && (
          <h1 className="text-4xl font-bold mb-4 animate-pulse bg-gradient-to-r from-green-400 via-white to-green-400 bg-clip-text text-transparent drop-shadow-md">
            Welcome back, {user.username} 👋
          </h1>
        )}

        {user && (
          <div className="mb-6">
            <p className="text-lg">🏆 <span className="font-semibold">Score:</span> {animatedScore}</p>
          </div>
        )}
      
        <h2 className="text-2xl font-semibold mb-4">Challenges</h2>

        {loading ? (
          <div className="text-center text-gray-300 mt-12 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-400 border-opacity-80" />
            <p>Loading challenges...</p>
          </div>
        ) : challenges.length === 0 ? (
          <p className="text-center text-red-400 mt-12">No challenges found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => {
              const isUnlocked = index === 0 || challenges[index - 1]?.completed;

              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  index={index}
                  isUnlocked={isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      navigate(
                        `/challenge/${challenge.vulnerability.toLowerCase().replace(/\s+/g, "-")}`
                      );
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
