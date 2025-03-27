import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-extrabold text-green-400">CyberSim</h1>
        <Link
          to="/login"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="text-center px-6 flex-1 flex flex-col justify-center items-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Train to Defend, Learn to Hack 🛡️
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          CyberSim is an interactive cybersecurity training simulator. Learn how
          real-world attacks like SQL Injection work — then stop them.
        </p>
        <Link
          to="/login"
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg transition"
        >
          Start Learning Now
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 p-4">
        © {new Date().getFullYear()} CyberSim. For educational purposes only.
      </footer>
    </div>
  );
}
