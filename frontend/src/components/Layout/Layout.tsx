import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import '../../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <h1>Fifi Resorts (Pvt) Ltd</h1>
          <span className="property-code">30200</span>
        </div>
        <div className="header-right">
          <span className="user-info">{user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <nav className="sidebar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/stay-view">Stay View</Link></li>
          <li><Link to="/room-view">Room View</Link></li>
          <li><Link to="/reservations">Reservations</Link></li>
          <li><Link to="/guests">Guest Database</Link></li>
          <li><Link to="/housekeeping">Housekeeping</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
