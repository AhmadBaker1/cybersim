export default function ProgressTracker({ level, currentXP, totalXP, challengesCompleted, totalChallenges }) {
    const xpPercent = Math.min((currentXP / totalXP) * 100, 100);
  
    return (
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg border border-pink-600">
        <h3 className="text-xl font-bold mb-2">🚀 Progress Tracker</h3>
        
        <p className="text-sm mb-1">
          Level <span className="font-bold text-pink-400">{level}</span> · {currentXP} / {totalXP} XP
        </p>
  
        <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-green-400 to-pink-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
  
        <p className="text-sm text-gray-300">
          Challenges Completed: <span className="text-green-400">{challengesCompleted}</span> / {totalChallenges}
        </p>
      </div>
    );
  }
  