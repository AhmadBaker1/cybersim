import { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import ChallengeNavbar from "../src/components/ChallengeNavbar";
import { API_BASE_URL } from "../src/config";

// Optional TypingHints Component (included below)
function TypingHints({ hints }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [char, setChar] = useState(0);

  useEffect(() => {
    const current = hints[index];
    if (char < current.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + current[char]);
        setChar((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const reset = setTimeout(() => {
        setText("");
        setChar(0);
        setIndex((prev) => (prev + 1) % hints.length);
      }, 2500);
      return () => clearTimeout(reset);
    }
  }, [char, index, hints]);

  return <span className="animate-pulse">{text}</span>;
}

export default function JwtTokenChallenge() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [token, setToken] = useState("");
  const [editedToken, setEditedToken] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [editablePayload, setEditablePayload] = useState("");

  const getToken = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/jwt/login`);
      const receivedToken = res.data.token;
      setToken(receivedToken);
      setEditedToken(receivedToken);
      decodeJwt(receivedToken);
      setResponse(null);
      setError(null);
    } catch (err) {
      setError("Failed to fetch token");
      console.log(err);
    }
  };

  const decodeJwt = (jwt) => {
    try {
      const [header, payload] = jwt.split(".");
      const decodedHeader = JSON.parse(atob(header));
      const decodedPayload = JSON.parse(atob(payload));
      setDecodedHeader(JSON.stringify(decodedHeader, null, 2));
      setDecodedPayload(JSON.stringify(decodedPayload, null, 2));
      setEditablePayload(JSON.stringify(decodedPayload, null, 2));
    } catch (e) {
      setDecodedHeader("");
      setDecodedPayload("");
      setEditablePayload("");
      console.log(e);
    }
  };

  const rebuildToken = () => {
    try {
      const [headerB64, , signature] = editedToken.split(".");
      const newPayloadObj = JSON.parse(editablePayload);
      const newPayloadStr = JSON.stringify(newPayloadObj);
      const newPayloadB64 = btoa(unescape(encodeURIComponent(newPayloadStr)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const newToken = `${headerB64}.${newPayloadB64}.${signature}`;
      setEditedToken(newToken);
      decodeJwt(newToken);
    } catch (err) {
      setError("Invalid payload format. Make sure it’s valid JSON.");
      console.log(err);
    }
  };

  const submitToken = async () => {
    if (!user) return setError("User not loaded yet");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/jwt/secret`, {
        headers: {
          Authorization: `Bearer ${editedToken}`,
        },
      });
      setResponse(res.data.secret);
      setError(null);
      confetti();

      await axios.post(
        `${API_BASE_URL}/api/challenges/complete`,
        { challengeName: "JWT Token Manipulation" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      setResponse(null);
      setError(err.response?.data?.message || "Error submitting token");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        console.log(err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gray-950 text-white">
      <ChallengeNavbar />
      <div className="max-w-6xl mx-auto px-6 mt-4">
        <button
          onClick={() => window.history.back()}
          className="text-sm font-mono text-green-400 hover:text-lime-300 transition underline underline-offset-4"
        >
          ← Back to Challenges
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto p-6">
        {/* Left Info Panel */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-yellow-500">
          <h2 className="text-3xl font-bold mb-2 text-yellow-400">
            🔐 JWT Token Manipulation
          </h2>
          <p className="text-sm text-gray-300 mb-4 font-mono">
            🧠 Modify the token's payload to escalate privileges.
            Can you become <code>admin</code> and unlock the secret?
          </p>
          <div className="text-sm text-lime-300 h-6 mb-4 font-mono">
            <TypingHints
              hints={[
                `Hint: Try changing "role": "user" → "admin"`,
                "JWTs use base64-encoded JSON",
                "Rebuild after editing the payload 🧪",
              ]}
            />
          </div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-yellow-500 text-black text-sm px-4 py-2 rounded hover:bg-yellow-400 transition mb-4"
          >
            💡 {showHint ? "Hide Hint" : "Show Hint"}
          </button>

          {showHint && (
            <div className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded mb-4 text-sm">
              You can decode and modify the JWT using tools like{" "}
              <a
                href="https://jwt.io"
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-300"
              >
                jwt.io
              </a>{" "}
              or in-browser. Edit the <code>"role"</code> claim, rebuild the
              token, and submit it. No signature check!
            </div>
          )}
        </div>

        {/* Right Interaction Panel */}
        <div className="bg-black p-6 rounded-2xl shadow-lg border border-gray-700">
          <button
            onClick={getToken}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-4 text-white"
          >
            🪙 Get Token
          </button>

          {token && (
            <>
              <label className="block font-semibold mb-1 text-sm">
                🔧 Edit Raw JWT Token:
              </label>
              <textarea
                className="w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded mb-4 text-xs text-lime-300"
                value={editedToken}
                onChange={(e) => setEditedToken(e.target.value)}
              />
                <p className="text-sm text-gray-400 mb-2">
                    🔍 Click <strong>Decode Again</strong> to make the decoded payload editable.
                </p>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => decodeJwt(editedToken)}
                  className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 text-sm"
                >
                  🔍 Decode Again
                </button>
                <button
                  onClick={() => {
                    setEditedToken(token);
                    decodeJwt(token);
                  }}
                  className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-800 text-sm"
                >
                  ♻️ Reset Token
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">
                    Header
                  </label>
                  <pre className="bg-gray-900 p-2 rounded text-xs h-40 overflow-auto text-white">
                    {decodedHeader}
                  </pre>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-yellow-400">
                    Original Payload
                  </label>
                  <pre className="bg-gray-900 p-2 rounded text-xs h-40 overflow-auto text-white">
                    {decodedPayload}
                  </pre>
                </div>
              </div>

              <label className="block text-sm font-semibold mb-1 text-yellow-400">
                ✍️ Editable Payload
              </label>
              <textarea
                className="w-full h-40 p-2 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                value={editablePayload}
                onChange={(e) => setEditablePayload(e.target.value)}
              />
              <p className="text-sm text-gray-400 mb-2">
                    🔄 Click <strong>Rebuild Token</strong> to apply your payload changes.
                </p>

              <button
                onClick={rebuildToken}
                className="mt-3 mb-6 bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600 text-sm text-black"
              >
                🔄 Rebuild Token
              </button>

              <button
                onClick={submitToken}
                className={`w-full px-4 py-2 rounded text-white ${
                  user ? "bg-green-600 hover:bg-green-700" : "bg-gray-600"
                }`}
                disabled={!user?.id || loadingUser}
              >
                🚀 Submit Modified Token
              </button>
            </>
          )}

          {response && (
            <div className="mt-6 p-4 bg-green-800 rounded text-sm">
              ✅ <strong>Challenge Completed!</strong> <br />
              Secret: <code>{response}</code>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-800 rounded text-sm">
              ❌ <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
