import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl md:text-4xl font-extrabold text-green-400 hover:text-green-300 transition"
      >
        CyberSim
      </Link>

      {/* Desktop "Log In" */}
      <div className="hidden md:block">
        <Link
          to="/login"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow transition"
        >
          Log In
        </Link>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-green-400 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 border-t border-gray-700 p-4 md:hidden">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full text-center transition"
          >
            Log In
          </Link>
        </div>
      )}
    </nav>
  );
}
