import { Link, useNavigate } from "react-router-dom";

const Navbar2 = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/"); // redirect to landing page
        window.location.reload(); // optional: force refresh to clean state
      };

      return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 px-6 py-4 flex justify-between items-center shadow-md">
          <span className="text-3xl font-bold text-green-500 cursor-pointer" onClick={() => navigate("/challenge")}>
            CyberSim
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </nav>
      );
    };

    export default Navbar2;
    
