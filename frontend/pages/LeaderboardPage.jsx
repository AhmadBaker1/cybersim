import ChallengeNavbar from "../src/components/ChallengeNavbar";
import Leaderboard from "../src/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <>
      <ChallengeNavbar />
    <div className="min-h-screen bg-gray-950 text-white pt-20 px-4">
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">🏆 CyberSim Leaderboard</h2>
        <Leaderboard />
      </div>
    </div>
    </>
  );
}
