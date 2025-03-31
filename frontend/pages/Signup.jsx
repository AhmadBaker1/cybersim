import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../src/components/Navbar";
import MatrixRain from "../src/components/MatrixRain";
import { API_BASE_URL } from "../src/config.js";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        username,
        password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/challenge");
    } catch (err) {
      setError("Username may already exist or input is invalid.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16 text-white relative overflow-hidden">
        <MatrixRain />

        <div className="relative z-10 w-full max-w-md bg-black bg-opacity-40 backdrop-blur-md border border-lime-400 rounded-2xl p-8 shadow-xl animate-fade-in">
          <h1 className="text-3xl font-extrabold text-center mb-6 text-lime-400 tracking-wide ">
            Sign Up for CyberSim
          </h1>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-800 text-red-200 text-sm px-4 py-2 rounded font-mono border border-red-500">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 placeholder-gray-500 text-lime-300 focus:ring-2 focus:ring-lime-500 outline-none font-mono"
              required
            />

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 placeholder-gray-500 text-lime-300 focus:ring-2 focus:ring-lime-500 outline-none font-mono"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-500 to-green-400 hover:from-lime-600 hover:to-green-500 text-black font-bold py-3 rounded-xl transition"
            >
              ✨ Create Account
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-lime-400 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
