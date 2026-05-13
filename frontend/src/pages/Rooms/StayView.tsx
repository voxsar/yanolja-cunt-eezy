import React, { useEffect, useMemo, useState } from 'react';
import { format, isWeekend } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays, Info, Building2, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { OperationalSnapshot, Reservation, Room, RoomType } from '../../types';
import { addIsoDays, daysFrom, guestName, money, reservationStartsDay, reservationTouchesDay, sameIsoDay, todayIso } from '../../utils/pms';

const StayView: React.FC = () => {
  const [snapshot, setSnapshot] = useState<OperationalSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [cozy, setCozy] = useState(true);
  const [startDate, setStartDate] = useState(todayIso());
  const [rateType, setRateType] = useState('all');
  const [filter, setFilter] = useState('all');
  const [drawer, setDrawer] = useState<'assign' | 'info' | null>(null);
  const [assignments, setAssignments] = useState<Record<number, string>>({});

  const loadSnapshot = () => {
    setLoading(true);
    pmsService.snapshot(startDate, 20)
      .then(setSnapshot)
      .finally(() => setLoading(false));
  };

  useEffect(loadSnapshot, [startDate]);

  const days = useMemo(() => daysFrom(startDate, 20), [startDate]);
  const activeReservations = useMemo(() => {
    const reservations = snapshot?.reservations || [];
    return rateType === 'all' ? reservations : reservations.filter((reservation) => reservation.rateType === rateType);
  }, [snapshot, rateType]);
  const rateTypes = useMemo(() => {
    const values = new Set((snapshot?.reservations || []).map((reservation) => reservation.rateType).filter(Boolean));
    return Array.from(values) as string[];
  }, [snapshot]);
  const roomsByType = useMemo(() => {
    const map = new Map<number, Room[]>();
    snapshot?.rooms.forEach((room) => {
      const list = map.get(room.roomTypeId) || [];
      list.push(room);
      map.set(room.roomTypeId, list);
    });
    return map;
  }, [snapshot]);

  const visibleRoomsByType = useMemo(() => {
    const map = new Map<number, Room[]>();
    snapshot?.rooms.forEach((room) => {
      const include =
        filter === 'all' ||
        (filter === 'vacant' && room.status === 'available') ||
        (filter === 'dirty' && room.housekeepingStatus === 'dirty') ||
        (filter === 'dueOut' && activeReservations.some((reservation) => (
          reservation.roomId === room.id && reservation.status === 'checked_in' && sameIsoDay(reservation.checkOut, startDate)
        ))) ||
        room.status === filter;
      if (!include) return;
      const list = map.get(room.roomTypeId) || [];
      list.push(room);
      map.set(room.roomTypeId, list);
    });
    return map;
  }, [activeReservations, filter, snapshot, startDate]);

  const reservationsForRoom = (room: Room, day: Date) =>
    activeReservations.filter((reservation) => reservation.roomId === room.id && reservationTouchesDay(reservation, day));

  const reservationsForType = (roomType: RoomType, day: Date) =>
    activeReservations.filter((reservation) => reservation.roomTypeId === roomType.id && reservationTouchesDay(reservation, day));

  const typeAvailability = (roomType: RoomType, day: Date) => {
    const roomCount = roomsByType.get(roomType.id)?.length || 0;
    const occupied = reservationsForType(roomType, day).length;
    return Math.max(roomCount - occupied, 0);
  };

  const totals = useMemo(() => {
    if (!snapshot) return { all: 0, vacant: 0, occupied: 0, reserved: 0, blocked: 0, dueOut: 0, dirty: 0 };
    return {
      all: snapshot.rooms.length,
      vacant: snapshot.rooms.filter((room) => room.status === 'available').length,
      occupied: snapshot.rooms.filter((room) => room.status === 'occupied').length,
      reserved: snapshot.rooms.filter((room) => room.status === 'reserved').length,
      blocked: snapshot.rooms.filter((room) => room.status === 'blocked').length,
      dueOut: activeReservations.filter((reservation) => reservation.status === 'checked_in' && sameIsoDay(reservation.checkOut, startDate)).length,
      dirty: snapshot.rooms.filter((room) => room.housekeepingStatus === 'dirty').length
    };
  }, [activeReservations, snapshot, startDate]);

  if (loading || !snapshot) {
    return <div className="panel-surface page-loader">Loading stay view...</div>;
  }

  return (
    <div className="stay-view-container pms-page">
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
        <select className="compact-input" value={rateType} onChange={(event) => setRateType(event.target.value)}>
          <option value="all">All rate types</option>
          {rateTypes.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <label className="toggle-pill">
          <span>Cozy</span>
          <input type="checkbox" checked={cozy} onChange={(event) => setCozy(event.target.checked)} />
        </label>
        <button className="outline-button" onClick={() => setDrawer('assign')}>Assign Room</button>
        <button className="icon-button" aria-label="More information" onClick={() => setDrawer('info')}><Info size={20} /></button>
      </div>

      <div className={`calendar-shell ${cozy ? 'cozy' : ''}`}>
        <div className="calendar-row calendar-head">
          <div className="room-filter">
            <span>Room Type</span>
            <button className="round-nav" onClick={() => setStartDate(addIsoDays(startDate, -20))}><ChevronLeft size={18} /></button>
          </div>
          {days.map((day) => (
            <div key={day.toISOString()} className={`date-cell ${isWeekend(day) ? 'weekend' : ''}`}>
              <strong>{format(day, 'EEE')}</strong>
              <b>{format(day, 'dd')}</b>
              <span>{format(day, 'MMM')}</span>
            </div>
          ))}
          <button className="round-nav floating-next" onClick={() => setStartDate(addIsoDays(startDate, 20))}><ChevronRight size={18} /></button>
        </div>

        {snapshot.roomTypes.map((roomType) => (
          <React.Fragment key={roomType.id}>
            <div className="calendar-row room-type-row">
              <div className="room-title"><span>-</span><strong>{roomType.name}</strong></div>
              {days.map((day) => (
                <div key={day.toISOString()} className="inventory-cell">
                  <span className={typeAvailability(roomType, day) === 0 ? 'inventory-zero' : ''}>
                    {typeAvailability(roomType, day)}
                  </span>
                  <small>{Number(roomType.basePrice) > 0 ? money(roomType.basePrice) : 'N/A'}</small>
                </div>
              ))}
            </div>
            {(visibleRoomsByType.get(roomType.id) || []).map((room) => (
              <div className="calendar-row room-row" key={room.id}>
                <div className="room-name">
                  {room.roomNumber}
                  <Building2 size={14} />
                </div>
                {days.map((day) => {
                  const reservations = reservationsForRoom(room, day);
                  const starts = reservations.find((reservation) => reservationStartsDay(reservation, day));
                  return (
                    <div key={day.toISOString()} className="stay-cell">
                      {starts && <ReservationBlock reservation={starts} />}
                      {!starts && reservations.length === 0 && <span className="empty-stay" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </React.Fragment>
        ))}

        <div className="calendar-footer">
          <div>Available Inventory <Info size={13} /></div>
          {days.map((day) => {
            const available = snapshot.rooms.length - activeReservations.filter((reservation) => reservationTouchesDay(reservation, day)).length;
            return <strong key={day.toISOString()}>{available}</strong>;
          })}
          <div>Occupancy(%)</div>
          {days.map((day) => {
            const occupied = activeReservations.filter((reservation) => reservationTouchesDay(reservation, day)).length;
            return <strong key={day.toISOString()}>{snapshot.rooms.length ? Math.round((occupied / snapshot.rooms.length) * 100) : 0}</strong>;
          })}
        </div>
      </div>

      {drawer && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>{drawer === 'assign' ? 'Assign Room' : 'Stay View Summary'}</h2>
              <button className="icon-button" onClick={() => setDrawer(null)}><X size={22} /></button>
            </div>
            {drawer === 'assign' ? (
              <div className="drawer-form">
                {activeReservations.filter((reservation) => !reservation.roomId).length === 0 && (
                  <div className="empty-state">All visible reservations already have rooms assigned.</div>
                )}
                {activeReservations.filter((reservation) => !reservation.roomId).map((reservation) => (
                  <label key={reservation.id}>
                    {reservation.reservationNumber} - {guestName(reservation)}
                    <select
                      value={assignments[reservation.id] || ''}
                      onChange={(event) => setAssignments((current) => ({ ...current, [reservation.id]: event.target.value }))}
                    >
                      <option value="">-Select Room-</option>
                      {snapshot.rooms
                        .filter((room) => room.roomTypeId === reservation.roomTypeId && room.status === 'available')
                        .map((room) => <option key={room.id} value={room.id}>{room.roomNumber}</option>)}
                    </select>
                    <button
                      className="dark-button"
                      onClick={async () => {
                        const roomId = Number(assignments[reservation.id]);
                        if (!roomId) return;
                        await pmsService.updateReservation(reservation.id, { roomId, status: 'confirmed' });
                        setDrawer(null);
                        loadSnapshot();
                      }}
                    >
                      Assign
                    </button>
                  </label>
                ))}
              </div>
            ) : (
              <div className="metric-list">
                {Object.entries(totals).map(([label, value]) => (
                  <button key={label} onClick={() => { setFilter(label); setDrawer(null); }}>
                    <span>{label.replace('dueOut', 'due out')}</span>
                    <strong>{value}</strong>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

const ReservationBlock: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
  const source = reservation.source === 'booking_engine' ? 'B' : reservation.source === 'airbnb' ? 'A' : 'S';
  return (
    <div className="reservation-block" title={`${guestName(reservation)} - ${reservation.reservationNumber}`}>
      <span>{source}</span>
      <b>{guestName(reservation)}</b>
      <i>$</i>
    </div>
  );
};

export default StayView;
