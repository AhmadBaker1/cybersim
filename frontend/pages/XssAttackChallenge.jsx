import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeNavbar from "../src/components/ChallengeNavbar";
import confetti from "canvas-confetti";

export default function XssAttackChallenge() {
    const [input, setInput] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
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
        setShowIframe(false); // Hide the iframe before showing the new content

        try {
            const res = await fetch(`http://localhost:5000/api/xss/reflect`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ input }),
            });

            const html = await res.text();
            setIframeContent(html);
            setShowIframe(true); // Show the iframe after setting the content
        } catch (err) {
            alert("Something went wrong")
            console.log("XSS Reflect Error:", err);
        }
    };

    const handleMarkComplete = async () => {
        const token = localStorage.getItem("token");
      
        try {
            //https://cybersim-backend.onrender.com/api/challenges/complete
          const response = await fetch('http://localhost:5000/api/challenges/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ challengeName: 'XSS Attack' }),
          });
      
          const data = await response.json();
          console.log("Completion response:", data);

          if (response.status === 400 && data.message === 'Challenge already completed') {
            alert("⚠️ You've already completed this challenge.");
            setIsCompleted(true);
            return;
          }

          const user = JSON.parse(localStorage.getItem("user"));
          user.score += data.points;
          localStorage.setItem("user", JSON.stringify(user));

          if (response.ok) {
            setIsCompleted(true);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
            });
          alert("✅ Challenge marked as complete!");
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          });
          navigate("/challenge", { state: { refresh: true } });
        } else {
            throw new Error(data.message || "Something went wrong");
        }
        } catch (err) {
          console.error("Failed to mark challenge as complete:", err);
          alert("❌ Something went wrong.");
        }
      };

      return (
        <div className="min-h-screen pt-20 bg-gray-100 dark:bg-gray-950 text-gray-950 dark:text-white">
          <ChallengeNavbar />
    
          <div className="max-w-xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">XSS Attack Challenge</h2>
    
            <p className="mb-4 text-sm text-gray-500">
              Try to inject JavaScript like:
              <br />
              <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded inline-block mt-2">
                {`<script>window.parent.postMessage("xss-success", "*")</script>`}
              </code>
            </p>
    
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="input"
                placeholder="Enter input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 rounded-xl border dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="w-full p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:opacity-90"
              >
                Run Input
              </button>
            </form>
    
            {showIframe && (
              <iframe
                title="xss-reflect"
                srcDoc={iframeContent}
                className="w-full h-52 mt-6 border rounded-xl"
              />
            )}
    
            {isCompleted && (
              <p className="text-green-500 text-center mt-4 font-semibold">
                ✅ Challenge completed!
              </p>
            )}
          </div>
        </div>
      );
    }