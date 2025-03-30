import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../src/components/Navbar";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
              username,
              password,
            });

            const { user, token } = res.data;

            // Save the token and user 
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect to the dashboard 
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
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
            <h1 className="text-3xl font-bold mb-6">Log In to CyberSim</h1>
    
            <form
              onSubmit={handleLogin}
              className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
            >
              {error && (
                <div className="text-red-500 font-semibold text-sm">{error}</div>
              )}
    
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
    
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
    
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
              >
                Log In
              </button>
    
              <p className="text-sm text-center mt-2">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-green-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </>
      );
    }