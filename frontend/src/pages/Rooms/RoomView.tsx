import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CalendarDays, Link as LinkIcon, Info, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { OperationalSnapshot, Room } from '../../types';
import { guestName, reservationTouchesDay, sameIsoDay, todayIso } from '../../utils/pms';

const RoomView: React.FC = () => {
  const [snapshot, setSnapshot] = useState<OperationalSnapshot | null>(null);
  const [startDate, setStartDate] = useState(todayIso());
  const [filter, setFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    pmsService.snapshot(startDate, 20).then(setSnapshot);
  }, [startDate]);

  const totals = useMemo(() => {
    const rooms = snapshot?.rooms || [];
    return {
      all: rooms.length,
      vacant: rooms.filter((room) => room.status === 'available').length,
      occupied: rooms.filter((room) => room.status === 'occupied').length,
      reserved: rooms.filter((room) => room.status === 'reserved').length,
      blocked: rooms.filter((room) => room.status === 'blocked').length,
      dueOut: (snapshot?.reservations || []).filter((reservation) => reservation.status === 'checked_in' && sameIsoDay(reservation.checkOut, startDate)).length,
      dirty: rooms.filter((room) => room.housekeepingStatus === 'dirty').length
    };
  }, [snapshot, startDate]);

  const filteredRooms = useMemo(() => {
    const rooms = snapshot?.rooms || [];
    if (filter === 'all') return rooms;
    if (filter === 'vacant') return rooms.filter((room) => room.status === 'available');
    if (filter === 'dirty') return rooms.filter((room) => room.housekeepingStatus === 'dirty');
    if (filter === 'dueOut') {
      const dueRoomIds = new Set(
        (snapshot?.reservations || [])
          .filter((reservation) => reservation.status === 'checked_in' && sameIsoDay(reservation.checkOut, startDate))
          .map((reservation) => reservation.roomId)
      );
      return rooms.filter((room) => dueRoomIds.has(room.id));
    }
    return rooms.filter((room) => room.status === filter);
  }, [filter, snapshot, startDate]);

  if (!snapshot) {
    return <div className="panel-surface page-loader">Loading room view...</div>;
  }

  return (
    <div className="pms-page room-view-container">
      <div className="pms-toolbar">
        <label className="date-button">
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          <CalendarDays size={18} />
        </label>
        <div className="status-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All <span>{totals.all}</span></button>
          <button className={filter === 'vacant' ? 'active' : ''} onClick={() => setFilter('vacant')}>Vacant <span>{totals.vacant}</span></button>
          <button className={filter === 'occupied' ? 'active' : ''} onClick={() => setFilter('occupied')}>Occupied <span>{totals.occupied}</span></button>
          <button className={filter === 'reserved' ? 'active' : ''} onClick={() => setFilter('reserved')}>Reserved <span>{totals.reserved}</span></button>
          <button className={filter === 'blocked' ? 'active' : ''} onClick={() => setFilter('blocked')}>Blocked <span>{totals.blocked}</span></button>
          <button className={filter === 'dueOut' ? 'active' : ''} onClick={() => setFilter('dueOut')}>Due Out <span>{totals.dueOut}</span></button>
          <button className={filter === 'dirty' ? 'active' : ''} onClick={() => setFilter('dirty')}>Dirty <span>{totals.dirty}</span></button>
        </div>
        <div className="toolbar-spacer" />
        <button className="icon-button" onClick={() => setDrawerOpen(true)}><Info size={20} /></button>
      </div>
      <div className="room-card-grid">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} snapshot={snapshot} startDate={startDate} />
        ))}
      </div>
      {drawerOpen && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>Room View Summary</h2>
              <button className="icon-button" onClick={() => setDrawerOpen(false)}><X size={22} /></button>
            </div>
            <div className="metric-list">
              {Object.entries(totals).map(([label, value]) => (
                <button key={label} onClick={() => { setFilter(label); setDrawerOpen(false); }}>
                  <span>{label.replace('dueOut', 'due out')}</span>
                  <strong>{value}</strong>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

const RoomCard: React.FC<{ room: Room; snapshot: OperationalSnapshot; startDate: string }> = ({ room, snapshot, startDate }) => {
  const activeReservation = snapshot.reservations.find((reservation) => (
    reservation.roomId === room.id && reservationTouchesDay(reservation, new Date(`${startDate}T00:00:00`))
  ));
  const statusClass = room.status === 'available' ? 'vacant' : room.status === 'occupied' ? 'occupied' : 'reserved';
  const roomLabel = room.roomNumber.replace('Mount ', '').replace('Sunrise ', '').replace('Eco ', '');

  return (
    <div className={`room-card ${statusClass}`}>
      <div className="room-card-head">
        <strong>{roomLabel}</strong>
        <div>
          {activeReservation && <LinkIcon size={14} />}
          <span className="mini-alert">$</span>
        </div>
      </div>
      <span className="room-index">({room.id})</span>
      <div className="room-card-body">
        {activeReservation ? guestName(activeReservation) : ''}
      </div>
      <div className="room-card-foot">
        <Building2 size={18} />
        <Building2 size={18} />
      </div>
    </div>
  );
};

export default RoomView;
