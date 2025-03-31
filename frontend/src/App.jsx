import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ChallengeDashboard from '../pages/ChallengeDashboard';
import Admin from '../pages/Admin';
import SqlInjectionChallenge from '../pages/SqlInjectionChallenge';
import XssAttackChallenge from '../pages/XssAttackChallenge';
import JwtTokenChallenge from '../pages/jwtTokenChallenge';
import LeaderboardPage from '../pages/LeaderboardPage';
import PrivateRoute from './components/PrivateRoute';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/challenge" element={
        <PrivateRoute>
          <ChallengeDashboard />
        </PrivateRoute>
        }/>
      <Route path="/admin" element={<Admin />} />
      <Route path="/challenge/sql-injection" element={<SqlInjectionChallenge />} />
      <Route path="/challenge/xss-attack" element={<XssAttackChallenge />}/>
      <Route path="/challenge/jwt-token-manipulation" element={<JwtTokenChallenge />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
}


