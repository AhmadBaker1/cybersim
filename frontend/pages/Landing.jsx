import { Link } from "react-router-dom";
import Navbar from "../src/components/Navbar";

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-gray-950 text-white overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Train to Defend, Learn to Hack 🛡️
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
          CyberSim is an interactive cybersecurity training simulator. Learn how
          real-world attacks like SQL Injection work — then stop them.
        </p>
        <Link
          to="/login"
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg transition"
        >
          Start Learning Now
        </Link>
      </main>

      <footer className="text-center text-sm text-gray-500 p-4">
        © {new Date().getFullYear()} CyberSim. For educational purposes only.
      </footer>
    </div>
  );
}