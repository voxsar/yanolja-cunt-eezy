import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getCurrentUser } from './store/slices/authSlice';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import StayView from './pages/Rooms/StayView';
import RoomView from './pages/Rooms/RoomView';
import Reservations from './pages/Reservations/Reservations';
import AddReservation from './pages/Reservations/AddReservation';
import GuestDatabase from './pages/Guests/GuestDatabase';
import HouseStatus from './pages/Housekeeping/HouseStatus';
import BusinessSources from './pages/Configuration/BusinessSources';
import ChannelLogs from './pages/ChannelManager/ChannelLogs';
import GuestPortal from './pages/Guests/GuestPortal';
import PaymentGateway from './pages/Configuration/PaymentGateway';
import Promotions from './pages/Promotions/Promotions';
import UnsettledFolios from './pages/Folios/UnsettledFolios';
import Layout from './components/Layout/Layout';
import './styles/App.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('token') && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  if (loading && localStorage.getItem('token') && !user) {
    return <div className="boot-screen">Loading PMS workspace...</div>;
  }

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
        <Route path="/reservations/new" element={<AddReservation />} />
        <Route path="/guests" element={<GuestDatabase />} />
        <Route path="/guest-portal" element={<GuestPortal />} />
        <Route path="/housekeeping" element={<HouseStatus />} />
        <Route path="/business-sources" element={<BusinessSources />} />
        <Route path="/channel-logs" element={<ChannelLogs />} />
        <Route path="/payment-gateway" element={<PaymentGateway />} />
        <Route path="/packages" element={<Promotions />} />
        <Route path="/folios" element={<UnsettledFolios />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
