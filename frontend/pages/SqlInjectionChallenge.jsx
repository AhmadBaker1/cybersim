import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeNavbar from "../src/components/ChallengeNavbar";
import confetti from "canvas-confetti";
import TypingHints from "../src/components/TypingHints";
import { API_BASE_URL } from "../src/config";

export default function SqlInjectionChallenge() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sql-injection/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Something went wrong. Please try again." });
      console.log(err);
    }

    setLoading(false);
  };

  const handleMarkComplete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/challenges/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeName: "Login Bypass" }),
      });

      const data = await response.json();
      console.log("Completion response:", data);

      if (response.status === 400 && data.message === "Challenge already completed") {
        alert("⚠️ You've already completed this challenge.");
        setIsCompleted(true);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      user.score += data.points;
      localStorage.setItem("user", JSON.stringify(user));

      if (response.status === 400 && data.message === "Challenge already completed") {
        setIsCompleted(true);
        setAlreadyCompleted(true);
        return;
      }

      if (response.ok) {
        setIsCompleted(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        // navigate("/challenge", { state: { refresh: true } });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Failed to mark challenge as complete:", err);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-950 text-white">
      <ChallengeNavbar />
      <div className="max-w-6xl mx-auto px-6 mt-4">
        <button
            onClick={() => navigate("/challenge")}
            className="text-sm font-mono text-green-400 hover:text-lime-300 transition underline underline-offset-4"
        >
            ← Back to Challenges
        </button>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto p-6">
        {/* Left Panel - Info */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl border border-green-500">
          <h2 className="text-3xl font-mono mb-2 animate-pulse">🔓 SQL Injection</h2>
          <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs font-bold">EASY</span>

          <p className="mt-4 text-sm font-mono text-gray-400">
            Can you bypass the login form using SQL Injection?
          </p>

          <div className="mt-4 text-sm">
            <p>
              <span className="text-green-400">+40 XP</span> available · 
              <span className="ml-2">Level 2</span>
            </p>

            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-green-400 to-lime-500 h-2 rounded-full w-[60%] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form & Result */}
        <div className="bg-black border border-gray-800 rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-3 font-mono rounded-xl border border-gray-700 bg-gray-900 text-lime-300 placeholder-gray-600"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="text"
              name="password"
              placeholder="Password"
              className="w-full p-3 font-mono rounded-xl border border-gray-700 bg-gray-900 text-lime-300 placeholder-gray-600"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="w-full p-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 text-black font-semibold hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Checking..." : "Submit"}
            </button>
          </form>

          <div className="mt-6 font-mono text-sm text-gray-400 h-6">
                <TypingHints />
            </div>

          {result && (
            <div className="mt-6 p-4 rounded-xl border bg-gray-800 text-white text-center">
              {result.success ? (
                <>
                  <p className="text-lg font-semibold">
                    🎉 Logged in as: <span className="text-green-400">{result.role}</span>
                  </p>
                  <div className="mt-4 p-3 font-mono text-xs text-green-300 bg-gray-900 border border-green-600 rounded-lg">
                            <p className="mb-1 text-green-500">🧪 Simulated Query:</p>
                            <code>{result.query}</code>
                        </div>
                  {result.flag && (
                    <div className="mt-4">
                      <p className="text-green-400 font-mono text-sm">🏁 FLAG: {result.flag}</p>
                      <p className="text-yellow-400 text-3xl mt-2 animate-bounce">🏆</p>
                      <button
                        onClick={handleMarkComplete}
                        disabled={isCompleted}
                        className={`mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl ${
                          isCompleted ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isCompleted ? "Completed ✅" : "Mark as Complete"}
                      </button>
                      {isCompleted && !alreadyCompleted && (
                        <div className="mt-4 p-4 bg-green-900 border border-green-500 rounded text-center text-green-300 animate-fade-in">
                            🎉 <strong>Challenge marked as complete!</strong><br />
                            XP has been added to your profile.
                        </div>
                        )}

                        {alreadyCompleted && (
                            <div className="mt-4 p-4 bg-yellow-900 border border-yellow-500 rounded text-center text-yellow-300 animate-fade-in">
                                ⚠️ <strong>Challenge was already completed.</strong><br />
                                    No XP added, but you're still awesome 😎
                            </div>
                    )}

                    </div>
                  )}
                </>
              ) : (
                <p className="text-red-400 font-mono">{result.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
