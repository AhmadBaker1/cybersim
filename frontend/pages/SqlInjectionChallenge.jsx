import { useState } from "react";
import ChallengeNavbar from "../src/components/ChallengeNavbar";

export default function SqlInjectionChallenge() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // https://cybersim-backend.onrender.com/api/sql-injection/login
            const response = await fetch('http://localhost:5000/api/sql-injection/login',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setResult({ success: false, message: 'Something went wrong. Please try again.', err });
        }

        setLoading(false);
    };

    const handleMarkComplete = async () => {
        const token = localStorage.getItem("token");
      
        try {
          const response = await fetch('https://cybersim-backend.onrender.com/api/challenges/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ challengeName: 'SQL Injection' }),
          });
      
          const data = await response.json();
          console.log("Completion response:", data);
      
          setIsCompleted(true);
          alert("✅ Challenge marked as complete!");
        } catch (err) {
          console.error("Failed to mark challenge as complete:", err);
          alert("❌ Something went wrong.");
        }
      };

    return (
        <div className="min-h-screen pt-20 bg-gray-100 dark:bg-gray-950 text-gray-950 dark:text-white">
          <ChallengeNavbar />
      
          {/* Challenge UI */}
          <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              SQL Injection Challenge
            </h2>
      
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="w-full p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:opacity-90"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Submit'}
              </button>
            </form>
      
            {result && (
              <div className="mt-6 p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:text-white text-center">
                {result.success ? (
                  <>
                    <p className="text-lg font-semibold">
                      🎉 Logged in as: <span className="text-indigo-500">{result.role}</span>
                    </p>
                    {result.flag && (
                      <div className="mt-4">
                        <p className="text-green-400 font-mono text-sm">🏁 FLAG: {result.flag}</p>
                        <p className="text-yellow-400 text-3xl mt-2 animate-bounce">🏆</p>
                        <button
                          onClick={(handleMarkComplete)}
                          disabled={isCompleted}
                          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                        >
                          {isCompleted ? "Completed ✅" : "Mark as Complete"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-red-600">{result.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }