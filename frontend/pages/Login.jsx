import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../src/components/Navbar";
import MatrixRain from "../src/components/MatrixRain";
import { API_BASE_URL } from "../src/config.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/challenge");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      localStorage.removeItem("token");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16 text-white">
      <MatrixRain />
        <div className="w-full max-w-md bg-black bg-opacity-40 backdrop-blur-md border border-green-500 rounded-2xl p-8 shadow-xl animate-fade-in">
          <h1 className="text-3xl font-extrabold text-center mb-6 text-lime-400 tracking-wide">
            🔐 Log In to CyberSim
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-800 text-red-200 text-sm px-4 py-2 rounded font-mono border border-red-500">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 placeholder-gray-500 text-green-300 focus:ring-2 focus:ring-green-500 outline-none font-mono"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 placeholder-gray-500 text-green-300 focus:ring-2 focus:ring-green-500 outline-none font-mono"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-black font-bold py-3 rounded-xl transition"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
