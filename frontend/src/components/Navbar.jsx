import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const hideLogin = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/challenge";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 px-6 py-4 flex justify-between items-center shadow-md">
        <Link
        to="/"
        className="text-2xl md:text-4xl font-extrabold text-green-400 hover:text-green-300 transition"
        >
            CyberSim
        </Link>

      {!hideLogin && (
        <Link
          to="/login"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow transition"
          style={{ color: 'white', textDecoration: 'none' }} // force white
        >
          Log In
        </Link>
      )}
    </nav>
  );
}
