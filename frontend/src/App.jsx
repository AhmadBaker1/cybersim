import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ChallengeDashboard from '../pages/ChallengeDashboard';
import Admin from '../pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/challenge" element={<ChallengeDashboard />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}


