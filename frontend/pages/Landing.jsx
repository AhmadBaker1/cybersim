import { Link } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import MatrixRain from "../src/components/MatrixRain";

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-gray-950 text-white overflow-hidden relative flex flex-col">
      <Navbar />
      <MatrixRain />

      {/* Glow background overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-green-400/20 rounded-full blur-3xl top-16 left-16 animate-pulse" />
        <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-16 right-16 animate-pulse delay-200" />
      </div>

      {/* Main Hero Section */}
      <main className="flex-1 z-10 flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold font-mono leading-tight drop-shadow-[0_0_10px_#00ff88] animate-fade-in">
          CyberSim
        </h1>

        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-300 animate-fade-in delay-100 font-mono">
          Master real-world cyber attacks like <span className="text-green-400">SQL Injection</span>,
          <span className="text-pink-400"> XSS</span>, and <span className="text-yellow-400">JWT manipulation</span> — through hands-on hacking simulations.
        </p>

        <Link
          to="/login"
          className="mt-10 bg-gradient-to-r from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-black px-8 py-3 rounded-full font-bold text-lg shadow-lg animate-float transition-transform hover:scale-105"
        >
          🚀 Enter the Simulator
        </Link>
      </main>

      <footer className="text-center text-sm text-gray-600 font-mono py-4 border-t border-gray-800 relative z-10">
        © {new Date().getFullYear()} <span className="text-green-400">CyberSim</span> — For education, not exploitation.
      </footer>
    </div>
  );
}
