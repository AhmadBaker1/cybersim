import { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import ChallengeNavbar from "../src/components/ChallengeNavbar";

export default function JwtTokenChallenge() {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [token, setToken] = useState('');
    const [editedToken, setEditedToken] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [showHint, setShowHint] = useState(false);

    const [decodedHeader, setDecodedHeader] = useState('');
    const [decodedPayload, setDecodedPayload] = useState('');
    const [editablePayload, setEditablePayload] = useState('');

    const getToken = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/jwt/login');
            const receivedToken = res.data.token;
            setToken(receivedToken);
            setEditedToken(receivedToken);
            setResponse(null);
            setError(null);
        } catch (err) {
            setError('Failed to fetch token');
            console.log(err);
        }
    };

    const decodeJwt = (jwt) => {
        try {
            const [header, payload] = jwt.split('.');
            const decodedHeader = JSON.parse(atob(header));
            const decodedPayload = JSON.parse(atob(payload));
            setDecodedHeader(JSON.stringify(decodedHeader, null, 2));
            setDecodedPayload(JSON.stringify(decodedPayload, null, 2));
            setEditablePayload(JSON.stringify(decodedPayload, null, 2));
        } catch (e) {
            setDecodedHeader('');
            setDecodedPayload('');
            setEditablePayload('');
            console.log(e);
        }
    };

    const rebuildToken = () => {
        try {
          const [headerB64, , signature] = editedToken.split('.');
          const newPayloadObj = JSON.parse(editablePayload);
          const newPayloadStr = JSON.stringify(newPayloadObj);
          const newPayloadB64 = btoa(unescape(encodeURIComponent(newPayloadStr))) // safely encode
      
            .replace(/\+/g, '-')  // base64url
            .replace(/\//g, '_')
            .replace(/=+$/, '');
      
          const newToken = `${headerB64}.${newPayloadB64}.${signature}`;
          setEditedToken(newToken);
          decodeJwt(newToken);
        } catch (err) {
          setError('Invalid payload format. Make sure it\'s valid JSON.');
          console.log(err);
        }
      };

    const submitToken = async () => {
        if (!user) return setError('User not loaded yet');
        try {
            const res = await axios.get('http://localhost:5000/api/jwt/secret', {
                headers: {
                    Authorization: `Bearer ${editedToken}`,
                },
            });
            setResponse(res.data.secret);
            setError(null);
            confetti();
            await axios.post('http://localhost:5000/api/challenges/complete', {
                challengeName: 'JWT Token Manipulation',
              }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,  // 🛡️ Include auth token
                },
              });
        } catch (err) {
            setResponse(null);
            setError(err.response?.data?.message || 'Error submitting token');
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = localStorage.getItem('token');
            console.log('📦 Token in localStorage:', storedToken);
          try {
            const res = await axios.get('http://localhost:5000/api/auth/profile', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setUser(res.data.user);
          } catch (err) {
            console.error('❌ Failed to fetch user', err);
            setUser(null); 
          } finally {
            setLoadingUser(false); 
          }
        };
      
        fetchUser();
      }, []);

    return (
        <div className="min-h-screen pt-20 bg-gray-950 text-white">
          <ChallengeNavbar />
          <div className="max-w-3xl mx-auto p-6">
    
            <h1 className="text-3xl font-bold mb-2">🔐 JWT Token Manipulation</h1>
            <p className="text-gray-300 mb-4">
              🧠 In this challenge, you're given a JWT (JSON Web Token) with limited privileges.
              Your goal is to elevate your role by modifying the token's payload, bypassing access controls.
            </p>
    
            <button
              onClick={() => setShowHint(!showHint)}
              className="bg-yellow-500 text-black text-sm px-4 py-2 rounded hover:bg-yellow-400 transition mb-4 mr-3"
            >
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
    
            {showHint && (
              <div className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded mb-4 text-sm">
                Use tools like <a href="https://jwt.io" target="_blank" rel="noreferrer" className="underline text-blue-300">jwt.io</a> or your browser console to decode the token using <code>atob()</code>. Change the payload’s <code>"role"</code> from <code>"user"</code> to <code>"admin"</code>, re-encode it, and submit the modified token. The server does not verify signatures properly — take advantage of this!
              </div>
            )}
    
            <button
              onClick={getToken}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Get Token
            </button>
    
            {token && (
              <>
                <label className="block font-semibold mb-1">Modify JWT Token:</label>
                <textarea
                  className="w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded mb-4 text-sm"
                  value={editedToken}
                  onChange={(e) => setEditedToken(e.target.value)}
                />
                <p className="text-sm text-gray-400 mb-2">
                    🔍 Click <strong>Decode Again</strong> to make the decoded payload editable.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
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
    
                <label className="block font-semibold mb-1">Edit Decoded Payload:</label>
                <textarea
                  className="w-full h-40 p-2 bg-gray-900 border border-gray-600 rounded text-xs"
                  value={editablePayload}
                  onChange={(e) => setEditablePayload(e.target.value)}
                />
                <p className="text-sm text-gray-400 mb-2">
                    🔄 Click <strong>Rebuild Token</strong> to apply your payload changes.
                </p>
                <button
                  onClick={rebuildToken}
                  className="mt-2 mb-6 bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  🔄 Rebuild Token with Updated Payload
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block font-semibold mb-1">Decoded Header:</label>
                        <pre className="bg-gray-900 p-2 rounded text-xs h-40 overflow-auto">
                            {decodedHeader}
                        </pre>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Decoded Payload:</label>
                        <pre className="bg-gray-900 p-2 rounded text-xs h-40 overflow-auto">
                            {decodedPayload}
                        </pre>
                    </div>
                </div>
                {token && !user && (
                    <div className="flex items-center gap-2 mt-4 mb-4 text-yellow-300 text-sm">
                        <svg
                        className="animate-spin h-4 w-4 text-yellow-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                        </svg>
                        Loading user... Please wait.
                    </div>
                    )}
                <button
                    onClick={submitToken}
                    className={`px-4 py-2 rounded ${user ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
                    disabled={!user?.id || loadingUser}
                    >
                    Submit Modified Token
                </button>
              </>
            )}
    
            {response && (
              <div className="mt-6 p-4 bg-green-800 rounded">
                ✅ <strong>Challenge Completed!</strong> <br />
                Secret: <code>{response}</code>
              </div>
            )}
    
            {error && (
              <div className="mt-6 p-4 bg-red-800 rounded">
                ❌ <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>
      );
    }
