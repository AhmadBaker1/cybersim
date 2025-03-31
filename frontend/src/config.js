const IS_PROD = import.meta.env.VITE_API_MODE === "production";
// deploy
export const API_BASE_URL = IS_PROD
  ? "https://cybersim-backend.onrender.com"
  : "http://localhost:5000";