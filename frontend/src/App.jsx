import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ChallengeDashboard from '../pages/ChallengeDashboard';
import Admin from '../pages/Admin';
import SqlInjectionChallenge from '../pages/SqlInjectionChallenge';
import XssAttackChallenge from '../pages/XssAttackChallenge';
import JwtTokenChallenge from '../pages/jwtTokenChallenge';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/challenge" element={<ChallengeDashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/challenge/sql-injection" element={<SqlInjectionChallenge />} />
      <Route path="/challenge/xss-attack" element={<XssAttackChallenge />}/>
      <Route path="/challenge/jwt-token-manipulation" element={<JwtTokenChallenge />} />
    </Routes>
  );
}


