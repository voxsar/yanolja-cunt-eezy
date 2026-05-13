import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  ChevronDown,
  CircleDollarSign,
  Grid3X3,
  HelpCircle,
  House,
  LogOut,
  Mail,
  Menu,
  Megaphone,
  MonitorCog,
  Package,
  Search,
  Settings,
  UserRound,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import '../../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [headerDrawer, setHeaderDrawer] = useState<'notifications' | 'announcements' | null>(null);
  const [quickSearch, setQuickSearch] = useState('');

  const handleLogout = () => {
    dispatch(logout());
  };

  const primaryLinks = useMemo(() => [
    { to: '/stay-view', label: 'Stay View', icon: Calendar },
    { to: '/room-view', label: 'Room View', icon: House },
    { to: '/reservations', label: 'Reservations', icon: CalendarCheck },
    { to: '/reservations/new', label: 'Add Reservation', icon: CalendarPlus },
    { to: '/housekeeping', label: 'House Status', icon: MonitorCog },
    { to: '/packages', label: 'Packages & Promotions', icon: Package },
    { to: '/business-sources', label: 'Business Source', icon: Settings },
    { to: '/channel-logs', label: 'Channel Logs', icon: Grid3X3 },
    { to: '/payment-gateway', label: 'Payment Gateway', icon: CircleDollarSign },
    { to: '/guest-portal', label: 'Guest Portal', icon: Mail },
    { to: '/folios', label: 'Unsettled Folios', icon: HelpCircle }
  ], []);

  const submitQuickSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = quickSearch.trim();
    if (!query) return;
    navigate(`/reservations?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <button className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <Link to="/stay-view" className="brand-lockup">
            <strong>Fifi Resorts (Pvt) Ltd</strong>
            <span>30200</span>
          </Link>
        </div>
        <form className="quick-search" onSubmit={submitQuickSearch}>
          <input value={quickSearch} onChange={(event) => setQuickSearch(event.target.value)} placeholder="Quick Search" />
          <Search size={18} />
        </form>
        <div className="header-right">
          <Link to="/reservations/new" className="top-tool" title="Add reservation">
            <CalendarPlus size={20} />
          </Link>
          <Link to="/reservations" className="top-tool" title="Reservations">
            <CalendarCheck size={20} />
          </Link>
          <Link to="/stay-view" className="top-tool" title="Stay calendar">
            <Calendar size={20} />
          </Link>
          <Link to="/guest-portal" className="top-tool" title="Messages">
            <Mail size={20} />
          </Link>
          <Link to="/folios" className="top-tool" title="Folios">
            <CircleDollarSign size={20} />
          </Link>
          <Link to="/channel-logs" className="top-tool" title="Channel manager">
            <Grid3X3 size={20} />
          </Link>
          <button className="top-tool with-badge" title="Notifications" onClick={() => setHeaderDrawer('notifications')}>
            <Bell size={20} />
            <span>1</span>
          </button>
          <button className="top-tool with-badge" title="Announcements" onClick={() => setHeaderDrawer('announcements')}>
            <Megaphone size={20} />
            <span>9+</span>
          </button>
          <button className="user-trigger" onClick={() => setUserMenuOpen((open) => !open)}>
            <UserRound size={25} />
            <ChevronDown size={16} />
          </button>
          {userMenuOpen && (
            <div className="user-menu">
              <div className="user-menu-head">
                <span>{user?.firstName?.[0] || user?.username?.[0] || 'R'}</span>
                <div>
                  <strong>{user?.username}</strong>
                  <small>{user?.role}</small>
                </div>
              </div>
              <Link to="/reservations" onClick={() => setUserMenuOpen(false)}>Go to Booking Engine</Link>
              <Link to="/business-sources" onClick={() => setUserMenuOpen(false)}>Go to Configuration</Link>
              <Link to="/payment-gateway" onClick={() => setUserMenuOpen(false)}>Marketplace</Link>
              <button onClick={handleLogout}><LogOut size={18} /> Logout</button>
            </div>
          )}
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="app-menu" onClick={(event) => event.stopPropagation()}>
            <div className="app-menu-head">
              <div>
                <strong>Fifi Resorts</strong>
                <span>PMS Workspace</span>
              </div>
              <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            {primaryLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <NavLink to="/guests" onClick={() => setMenuOpen(false)}>
              <UserRound size={18} />
              Guest Database
            </NavLink>
          </nav>
        </div>
      )}

      {headerDrawer && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>{headerDrawer === 'notifications' ? 'Notifications' : 'Announcements'}</h2>
              <button className="icon-button" onClick={() => setHeaderDrawer(null)} aria-label="Close panel">
                <X size={22} />
              </button>
            </div>
            <div className="drawer-list">
              {headerDrawer === 'notifications' ? (
                <>
                  <button onClick={() => { navigate('/reservations'); setHeaderDrawer(null); }}>Upcoming arrivals need review</button>
                  <button onClick={() => { navigate('/housekeeping'); setHeaderDrawer(null); }}>Dirty rooms pending housekeeping</button>
                  <button onClick={() => { navigate('/folios'); setHeaderDrawer(null); }}>Open balances in unsettled folios</button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('/channel-logs'); setHeaderDrawer(null); }}>Channel sync activity is available</button>
                  <button onClick={() => { navigate('/packages'); setHeaderDrawer(null); }}>Review active packages and promotions</button>
                  <button onClick={() => { navigate('/payment-gateway'); setHeaderDrawer(null); }}>Payment gateway settings are configured</button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
