const mockUsers = [
    { username: "RedTeamRex", level: 7, score: 880 },
    { username: "XSS_Master", level: 6, score: 800 },
    { username: "CyberNova", level: 5, score: 720 },
  ];
  
  export default function Leaderboard({ users = mockUsers }) {
    return (
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-xl border border-blue-500">
        <h3 className="text-xl font-bold mb-4">🏆 Leaderboard</h3>
        
        <ul className="space-y-3">
          {users.map((user, idx) => (
            <li
              key={user.username}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono text-yellow-400">#{idx + 1}</span>
                <span className="font-semibold">{user.username}</span>
              </div>
              <div className="text-sm text-right">
                <p className="text-pink-400">Lvl {user.level}</p>
                <p>{user.score} XP</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  