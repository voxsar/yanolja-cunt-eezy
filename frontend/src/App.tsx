import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import StayView from './pages/Rooms/StayView';
import RoomView from './pages/Rooms/RoomView';
import Reservations from './pages/Reservations/Reservations';
import GuestDatabase from './pages/Guests/GuestDatabase';
import HouseStatus from './pages/Housekeeping/HouseStatus';
import Layout from './components/Layout/Layout';
import './styles/App.css';

const App: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stay-view" element={<StayView />} />
        <Route path="/room-view" element={<RoomView />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/guests" element={<GuestDatabase />} />
        <Route path="/housekeeping" element={<HouseStatus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
