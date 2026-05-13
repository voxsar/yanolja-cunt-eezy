import React, { useEffect, useMemo, useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { Guest } from '../../types';

const GuestDatabase: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    country: '',
    company: ''
  });

  const load = () => {
    pmsService.guests().then(setGuests);
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return guests.filter((guest) =>
      `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(lower) ||
      (guest.email || '').toLowerCase().includes(lower) ||
      (guest.mobile || '').toLowerCase().includes(lower)
    );
  }, [guests, query]);

  const createGuest = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) return;
    await pmsService.createGuest({ ...draft, isVIP: false });
    setDraft({ title: 'Mr.', firstName: '', lastName: '', mobile: '', email: '', country: '', company: '' });
    setDrawerOpen(false);
    load();
  };

  return (
    <div className="pms-page guest-database-container">
      <div className="pms-toolbar">
        <h2>Guest Database</h2>
        <label className="inline-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Quick Search by Name, Mobile, Email" />
        </label>
        <div className="toolbar-spacer" />
        <button className="outline-button" onClick={() => setDrawerOpen(true)}><UserPlus size={17} /> Add Guest</button>
      </div>
      <div className="panel-surface data-table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Country</th>
              <th>VIP</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.title} {guest.firstName} {guest.lastName}</td>
                <td>{guest.mobile || '-'}</td>
                <td>{guest.email || '-'}</td>
                <td>{guest.country || '-'}</td>
                <td>{guest.isVIP ? 'Yes' : 'No'}</td>
                <td>{guest.company || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {drawerOpen && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>Add Guest</h2>
              <button className="icon-button" onClick={() => setDrawerOpen(false)}><X size={22} /></button>
            </div>
            <div className="drawer-form">
              <label>Title<select value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}>
                <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
              </select></label>
              <label>First Name<input value={draft.firstName} onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))} /></label>
              <label>Last Name<input value={draft.lastName} onChange={(event) => setDraft((current) => ({ ...current, lastName: event.target.value }))} /></label>
              <label>Mobile<input value={draft.mobile} onChange={(event) => setDraft((current) => ({ ...current, mobile: event.target.value }))} /></label>
              <label>Email<input value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /></label>
              <label>Country<input value={draft.country} onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))} /></label>
              <label>Company<input value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} /></label>
              <div className="drawer-actions"><button className="outline-button" onClick={() => setDrawerOpen(false)}>Cancel</button><button className="dark-button" onClick={createGuest}>Save</button></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default GuestDatabase;
