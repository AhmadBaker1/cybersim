import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ChallengeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 text-white z-50 border-b border-green-500 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/challenge"
          className="text-2xl font-bold font-mono tracking-widest text-green-400 hover:text-lime-300 transition-all duration-300 drop-shadow-[0_0_6px_#00ff88]"
        >
          CyberSim
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-sm font-semibold font-mono">
          <Link to="/challenge" className="hover:text-green-400 transition">Challenges</Link>
          <Link to="/leaderboard" className="hover:text-yellow-400 transition">🏆 Leaderboard</Link>
          <button
          onClick={handleLogout}
          className="hover:text-red-400 transition"
        >
          Logout
        </button>
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 text-sm font-mono animate-slide-down">
          <Link
            to="/challenge"
            onClick={() => setIsOpen(false)}
            className="block text-green-300 hover:text-green-500 transition"
          >
            Challenges
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setIsOpen(false)}
            className="block text-yellow-300 hover:text-yellow-500 transition"
          >
            🏆 Leaderboard
          </Link>
          <Link
            onClick={handleLogout}
            className="block text-red-300 hover:text-red-500 transition"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
