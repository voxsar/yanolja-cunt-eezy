import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarPlus, Grid3X3, List, Search, Box } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { Reservation } from '../../types';
import { dateLabel, guestName, money } from '../../utils/pms';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tab, setTab] = useState('Reservations');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    pmsService.reservations().then(setReservations);
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return reservations.filter((reservation) => {
      const matchesQuery = reservation.reservationNumber.toLowerCase().includes(lower) ||
        guestName(reservation).toLowerCase().includes(lower);
      if (!matchesQuery) return false;
      if (tab === 'Arrivals') return ['pending', 'confirmed'].includes(reservation.status);
      if (tab === 'Departures') return ['checked_in', 'checked_out'].includes(reservation.status);
      if (tab === 'In-house') return reservation.status === 'checked_in';
      return true;
    });
  }, [reservations, query, tab]);

  const tabCounts = {
    Reservations: reservations.length,
    Arrivals: reservations.filter((reservation) => ['pending', 'confirmed'].includes(reservation.status)).length,
    Departures: reservations.filter((reservation) => ['checked_in', 'checked_out'].includes(reservation.status)).length,
    'In-house': reservations.filter((reservation) => reservation.status === 'checked_in').length
  };

  return (
    <div className="pms-page reservations-container">
      <div className="pms-toolbar">
        <div className="tab-strip">
          {Object.entries(tabCounts).map(([label, count]) => (
            <button key={label} className={tab === label ? 'active' : ''} onClick={() => setTab(label)}>
              {label} <span>{count}</span>
            </button>
          ))}
        </div>
        <div className="toolbar-spacer" />
        <Link className="dark-button" to="/reservations/new"><CalendarPlus size={18} /> Add</Link>
        <button className={viewMode === 'grid' ? 'dark-square' : 'outline-button'} onClick={() => setViewMode('grid')}><Grid3X3 size={18} /></button>
        <button className={viewMode === 'list' ? 'dark-button' : 'outline-button'} onClick={() => setViewMode('list')}><List size={18} /></button>
        <label className="search-button">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        </label>
      </div>

      <div className="panel-surface data-table-shell">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Box size={48} />
            <span>No Data</span>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="record-grid">
            {filtered.map((reservation) => (
              <article className="record-card" key={reservation.id}>
                <div>
                  <strong>{reservation.reservationNumber}</strong>
                  <span className={`status-badge ${reservation.status}`}>{reservation.status.replace('_', ' ')}</span>
                </div>
                <h3>{guestName(reservation)}</h3>
                <p>{reservation.room?.roomNumber || reservation.roomType?.name || '-'}</p>
                <p>{dateLabel(reservation.checkIn)} to {dateLabel(reservation.checkOut)}</p>
                <b>$ {money(reservation.balanceAmount)}</b>
              </article>
            ))}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reservation #</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Arrival</th>
                <th>Departure</th>
                <th>Status</th>
                <th>Source</th>
                <th className="right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.reservationNumber}</td>
                  <td>{guestName(reservation)}</td>
                  <td>{reservation.room?.roomNumber || '-'}</td>
                  <td>{dateLabel(reservation.checkIn)}</td>
                  <td>{dateLabel(reservation.checkOut)}</td>
                  <td><span className={`status-badge ${reservation.status}`}>{reservation.status.replace('_', ' ')}</span></td>
                  <td>{reservation.source.replace('_', ' ')}</td>
                  <td className="right">$ {money(reservation.balanceAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reservations;
