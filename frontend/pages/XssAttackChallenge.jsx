import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeNavbar from "../src/components/ChallengeNavbar";
import confetti from "canvas-confetti";
import { API_BASE_URL } from "../src/config.js";

export default function XssAttackChallenge() {
  const [input, setInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [iframeContent, setIframeContent] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const [hasDetectedXSS, setHasDetectedXSS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const listener = (event) => {
      if (event.data === "xss-success" && !hasDetectedXSS) {
        setHasDetectedXSS(true);
        handleMarkComplete();
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [hasDetectedXSS]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowIframe(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/xss/reflect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ input }),
      });

      const html = await res.text();
      setIframeContent(html);
      setShowIframe(true);
    } catch (err) {
      alert("Something went wrong");
      console.log("XSS Reflect Error:", err);
    }
  };

  const handleMarkComplete = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/challenges/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeName: "XSS Attack" }),
      });

      const data = await response.json();
      console.log("Completion response:", data);

      if (response.status === 400 && data.message === "Challenge already completed") {
        setAlreadyCompleted(true);
        setIsCompleted(true);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      user.score += data.points;
      localStorage.setItem("user", JSON.stringify(user));

      if (response.ok) {
        setIsCompleted(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        // navigate("/challenge", { state: { refresh: true } });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Failed to mark challenge as complete:", err);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-950 text-white">
      <ChallengeNavbar />
      <div className="max-w-6xl mx-auto px-6 mt-4">
        <button
            onClick={() => navigate("/challenge")}
            className="text-sm font-mono text-green-400 hover:text-lime-300 transition underline underline-offset-4"
        >
            ← Back to Challenges
        </button>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto p-6">
        {/* Left Panel */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl border border-pink-500">
          <h2 className="text-3xl font-mono mb-2 animate-pulse">🛡️ XSS Attack</h2>
          <span className="bg-orange-600 px-3 py-1 rounded-full text-xs font-bold">MEDIUM</span>

          <p className="mt-4 text-sm font-mono text-gray-400">
            Inject a script that communicates back to the parent app.
          </p>

          <div className="mt-4 text-sm">
                <p>
                    <span className="text-pink-400">+60 XP</span> available · 
                    <span className="ml-2">Level 3</span>
                </p>

                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full w-[80%] animate-pulse"></div>
                </div>
            </div>

          {!isCompleted && (
            <p className="mt-6 text-red-500 font-mono animate-pulse">🔒 Challenge Locked</p>
          )}
          {isCompleted && (
            <p className="mt-6 text-green-500 font-mono animate-pulse">✅ Challenge Complete</p>
          )}
        </div>

        {/* Right Panel */}
        <div className="bg-black border border-gray-800 rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Try something malicious..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 font-mono rounded-xl border border-gray-700 bg-gray-900 text-green-400 placeholder-gray-600"
            />
            <button
              type="submit"
              className="w-full p-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:opacity-90"
            >
              Run Payload
            </button>
          </form>

          {showIframe && (
            <iframe
              title="xss-reflect"
              srcDoc={iframeContent}
              className="w-full h-60 mt-6 border border-pink-500 rounded-lg bg-white"
            />
          )}

          <div className="mt-4 font-mono bg-gray-800 text-green-400 p-4 rounded-xl">
            {hasDetectedXSS ? (
              <p>🟢 Payload executed successfully. Challenge complete!</p>
            ) : (
              <p>💬 Awaiting valid payload...</p>
            )}
          </div>

          {isCompleted && !alreadyCompleted && (
            <div className="mt-4 p-4 bg-green-900 border border-green-500 rounded text-center text-green-300 animate-fade-in">
                🎉 <strong>Challenge marked as complete!</strong><br />
                XP has been added to your profile.
                <div className="mt-3">
                <button
                    onClick={() => navigate("/challenge")}
                    className="text-sm underline text-lime-300 hover:text-green-400"
                >
                    ← Return to Challenges
                </button>
                </div>
            </div>
            )}

        {alreadyCompleted && (
            <div className="mt-4 p-4 bg-yellow-900 border border-yellow-500 rounded text-center text-yellow-300 animate-fade-in">
                ⚠️ <strong>Challenge was already completed.</strong><br />
                No XP added, but you're still awesome 😎
            </div>
        )}


          <details className="mt-4 text-sm text-gray-300">
            <summary className="cursor-pointer font-bold">🧠 Hint</summary>
            <p className="mt-2 font-mono animate-typewriter">
              Try: <code>{`<script>window.parent.postMessage("xss-success", "*")</script>`}</code>
            </p>
          </details>

        </div>
      </div>
    </div>
  );
}
