import { useEffect, useState } from "react";

export default function ChallengeCard({ challenge, isUnlocked, onClick, index }) {
  const [xpWidth, setXpWidth] = useState("0%");

  useEffect(() => {
    const calc = Math.min(challenge.points / 1.2, 100); // normalize
    setTimeout(() => setXpWidth(`${calc}%`), 100); // animate fill
  }, [challenge.points]);

  const getLevelColors = () => {
    switch (challenge.level) {
      case "Easy": return "from-green-500 to-emerald-600";
      case "Medium": return "from-yellow-400 to-orange-500";
      case "Hard": return "from-pink-500 to-red-600";
      default: return "from-gray-600 to-gray-800";
    }
  };

  const renderBadge = () => {
    if (challenge.completed) {
      return (
        <span className="absolute top-2 right-2 text-xs font-bold text-green-300 bg-black/60 border border-green-400 px-2 py-1 rounded-full shadow shadow-green-400 animate-pulse">
          ✅ Completed
        </span>
      );
    } else if (!isUnlocked) {
      return (
        <span className="absolute top-2 right-2 text-xs font-bold text-red-300 bg-black/60 border border-red-400 px-2 py-1 rounded-full shadow shadow-red-400">
          🔒 Locked
        </span>
      );
    } else {
      return (
        <span className="absolute top-2 right-2 text-xs font-bold text-yellow-300 bg-black/60 border border-yellow-400 px-2 py-1 rounded-full shadow shadow-yellow-300 animate-pulse">
          🟢 Ready
        </span>
      );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-6 border border-gray-800 bg-gradient-to-br ${getLevelColors()} 
      shadow-xl hover:shadow-[0_0_16px_#00ffae] transition-all duration-300 
      transform hover:-translate-y-1 hover:scale-105 ${
        !isUnlocked && "opacity-40 pointer-events-none grayscale"
      } cursor-pointer`}
    >
      {renderBadge()}

      <h3 className="text-xl font-bold">{challenge.name}</h3>
      <p className="text-sm italic text-white/80">{challenge.level}</p>
      <p className="text-xs mt-2 text-white/70">{challenge.description}</p>

      <div className="mt-4">
        <p className="text-xs text-white/70 mb-1">XP: {challenge.points}</p>
        <div className="h-2 bg-black/40 rounded overflow-hidden">
          <div
            className="h-full bg-lime-400 rounded transition-all duration-700 ease-out"
            style={{ width: xpWidth }}
          />
        </div>
      </div>

      {index === 0 && !challenge.completed && (
        <span className="inline-block mt-3 text-xs font-semibold bg-white text-black px-3 py-1 rounded-full shadow">
          🚀 Start Here
        </span>
      )}

      <p className="text-sm mt-3 text-white/80">
        {challenge.completed ? (
          <span>
            ✅ Completed on{" "}
            {new Date(challenge.completed_at).toLocaleDateString()}
          </span>
        ) : isUnlocked ? (
          "🟢 Ready to start"
        ) : (
          "🔒 Locked"
        )}
      </p>
    </div>
  );
}
