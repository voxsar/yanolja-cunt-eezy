import React, { useEffect, useState } from 'react';
import { Box, Search, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { GuestPortalRequest } from '../../types';
import { dateLabel } from '../../utils/pms';

const GuestPortal: React.FC = () => {
  const [requests, setRequests] = useState<GuestPortalRequest[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    pmsService.guestPortalRequests(query).then(setRequests);
  }, [query]);

  return (
    <div className="pms-page guest-portal-page">
      <div className="pms-toolbar">
        <h2>Guest Portal</h2>
        <label className="inline-search"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick Search by Reservation Num..." /><Search size={17} /></label>
        <div className="toolbar-spacer" />
        <button className="outline-button" onClick={() => setDrawerOpen(true)}><Search size={17} /> Search</button>
      </div>
      <PortalTable requests={requests.filter((request) => status === 'all' || request.status === status)} />
      {drawerOpen && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>Search Guest Portal</h2>
              <button className="icon-button" onClick={() => setDrawerOpen(false)}><X size={22} /></button>
            </div>
            <div className="drawer-form">
              <label>Reservation, Guest, Request<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
              <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select></label>
              <div className="drawer-actions">
                <button className="outline-button" onClick={() => { setQuery(''); setStatus('all'); }}>Reset</button>
                <button className="dark-button" onClick={() => setDrawerOpen(false)}>Search</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

const PortalTable: React.FC<{ requests: GuestPortalRequest[] }> = ({ requests }) => (
  <div className="panel-surface data-table-shell">
    <table className="data-table">
      <thead>
        <tr><th>Res #</th><th>Guest Name</th><th>Date</th><th>Room</th><th>Request</th><th>Booking Status</th><th>Status</th></tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>{request.reservationNumber}</td>
            <td>{request.guestName}</td>
            <td>{dateLabel(request.date)}</td>
            <td>{request.room || '-'}</td>
            <td>{request.request}</td>
            <td>{request.bookingStatus}</td>
            <td><span className={`status-badge ${request.status}`}>{request.status.replace('_', ' ')}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
    {requests.length === 0 && <div className="empty-state"><Box size={48} /><span>No Data</span></div>}
  </div>
);

export default GuestPortal;
