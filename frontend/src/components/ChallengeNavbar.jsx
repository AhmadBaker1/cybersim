import { useNavigate } from 'react-router-dom';

export default function ChallengeNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <span
        className="text-3xl font-bold text-green-500 cursor-pointer"
        onClick={() => navigate("/challenge")}
      >
        CyberSim
      </span>

      {/* Back Button */}
      <button
        onClick={() => navigate("/challenge")} 
        className="text-white border border-green-500 px-4 py-2 rounded-xl hover:bg-green-500 hover:text-black transition"
      >
        ← Back to Challenges
      </button>
    </nav>
  );
}