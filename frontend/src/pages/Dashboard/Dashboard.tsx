import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, DoorOpen, House, Sparkles, Users } from 'lucide-react';
import api from '../../services/api';
import { DashboardStats, Reservation } from '../../types';
import { dateLabel, guestName, money } from '../../utils/pms';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [arrivals, setArrivals] = useState<Reservation[]>([]);

  useEffect(() => {
    api.get('/dashboard/stats').then((response) => {
      setStats(response.data.stats);
      setArrivals(response.data.upcomingArrivals);
    });
  }, []);

  return (
    <div className="pms-page dashboard-container">
      <div className="pms-toolbar">
        <h2>Daily Workspace</h2>
        <div className="toolbar-spacer" />
        <Link to="/reservations/new" className="dark-button">Add Reservation</Link>
      </div>
      <div className="kpi-grid">
        <Kpi icon={<House size={22} />} label="Total Rooms" value={stats?.totalRooms || 0} />
        <Kpi icon={<DoorOpen size={22} />} label="Available" value={stats?.availableRooms || 0} />
        <Kpi icon={<Users size={22} />} label="In-house" value={stats?.inHouseGuests || 0} />
        <Kpi icon={<CalendarCheck size={22} />} label="Arrivals" value={stats?.arrivalsToday || 0} />
        <Kpi icon={<Sparkles size={22} />} label="Dirty Rooms" value={stats?.dirtyRooms || 0} />
      </div>
      <div className="dashboard-grid">
        <section className="panel-surface">
          <h3>Occupancy</h3>
          <div className="occupancy-meter">
            <span style={{ width: `${stats?.occupancyRate || 0}%` }} />
          </div>
          <strong>{stats?.occupancyRate || 0}%</strong>
          <p>Month revenue: $ {money(stats?.monthlyRevenue || 0)}</p>
        </section>
        <section className="panel-surface">
          <h3>Upcoming Arrivals</h3>
          <table className="data-table compact">
            <tbody>
              {arrivals.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{guestName(reservation)}</td>
                  <td>{reservation.room?.roomNumber || reservation.roomType?.name}</td>
                  <td>{dateLabel(reservation.checkIn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

const Kpi: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <section className="kpi-card">
    {icon}
    <span>{label}</span>
    <strong>{value}</strong>
  </section>
);

export default Dashboard;
