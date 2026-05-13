import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileClock, Pencil, Printer, Settings, X } from 'lucide-react';
import pmsService from '../../services/pms.service';
import { HousekeepingTask, Reservation, Room } from '../../types';
import { dateLabel, nights, sameIsoDay, todayIso } from '../../utils/pms';
import { downloadCsv, printElement } from '../../utils/ui';

const HouseStatus: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [drawer, setDrawer] = useState<'settings' | 'audit' | null>(null);

  const load = () => {
    Promise.all([
      pmsService.houseStatus(),
      pmsService.reservations(),
      pmsService.housekeepingTasks()
    ]).then(([houseStatus, reservationRows, taskRows]) => {
      setRooms(houseStatus.rooms);
      setReservations(reservationRows);
      setTasks(taskRows);
    });
  };

  useEffect(load, []);

  const grouped = useMemo(() => {
    return rooms.reduce<Record<string, Room[]>>((acc, room) => {
      const key = room.roomType?.name || 'Unmapped';
      acc[key] = [...(acc[key] || []), room];
      return acc;
    }, {});
  }, [rooms]);

  const updateHouseStatus = async (room: Room, value: Room['housekeepingStatus']) => {
    await pmsService.updateRoom(room.id, { housekeepingStatus: value });
    load();
  };

  const updateAssignee = async (room: Room, assignedTo: string) => {
    const existingTask = tasks.find((task) => task.roomId === room.id && task.status !== 'completed');
    const payload = { assignedTo: assignedTo || undefined };
    if (existingTask) {
      await pmsService.updateHousekeepingTask(existingTask.id, payload);
    } else {
      await pmsService.createHousekeepingTask({
        roomId: room.id,
        assignedTo: assignedTo || undefined,
        priority: room.status === 'occupied' || room.status === 'reserved' ? 'high' : 'medium',
        taskType: 'cleaning'
      });
    }
    load();
  };

  const roomReservation = (room: Room) => {
    const today = todayIso();
    return reservations
      .filter((reservation) => reservation.roomId === room.id && ['confirmed', 'checked_in'].includes(reservation.status))
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
      .find((reservation) => (
        reservation.status === 'checked_in' ||
        sameIsoDay(reservation.checkIn, today) ||
        new Date(reservation.checkIn) > new Date(`${today}T00:00:00`)
      ));
  };

  const roomTask = (room: Room) => tasks.find((task) => task.roomId === room.id && task.status !== 'completed');

  const roomMovementStatus = (room: Room, reservation?: Reservation) => {
    if (room.status === 'available') return 'Vacant';
    if (!reservation) return room.status.replace('_', ' ');
    if (reservation.status === 'checked_in' && sameIsoDay(reservation.checkOut, todayIso())) return 'Due Out';
    if (reservation.status === 'checked_in') return 'In House';
    if (sameIsoDay(reservation.checkIn, todayIso())) return 'Arriving Today';
    return 'Reserved';
  };

  const exportRows = rooms.map((room) => {
    const reservation = roomReservation(room);
    const task = roomTask(room);
    return {
      roomType: room.roomType?.name || 'Unmapped',
      room: room.roomNumber,
      pax: reservation ? `${reservation.adults}/${reservation.children}` : '0/0',
      houseStatus: room.housekeepingStatus,
      assignedTo: task?.assignedTo || 'Not Assigned',
      roomStatus: roomMovementStatus(room, reservation),
      arrival: reservation ? dateLabel(reservation.checkIn) : '',
      departure: reservation ? dateLabel(reservation.checkOut) : '',
      nights: reservation ? nights(reservation) : ''
    };
  });

  return (
    <div className="pms-page house-status-container">
      <div className="pms-toolbar">
        <h2>House Status View</h2>
        <div className="toolbar-spacer" />
        <button className="outline-button" onClick={() => printElement('House Status View', '.house-table')}><Printer size={17} /> Print</button>
        <button className="outline-button" onClick={() => downloadCsv('house-status.csv', exportRows)}><Download size={17} /> Export</button>
        <button className="outline-button" onClick={() => setDrawer('settings')}><Settings size={17} /> Settings</button>
        <button className="outline-button" onClick={() => setDrawer('audit')}><FileClock size={17} /> Audit Trail</button>
      </div>

      <div className="panel-surface data-table-shell">
        <table className="data-table house-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Room Type</th>
              <th>Pax</th>
              <th>House Status</th>
              <th>Assigned To</th>
              <th>Room Status</th>
              <th>Arrival Time</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Nights</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([roomType, group]) => (
              <React.Fragment key={roomType}>
                <tr className="group-row">
                  <td><input type="checkbox" /></td>
                  <td>{roomType}</td>
                  <td>
                    {group.reduce((total, room) => total + (roomReservation(room)?.adults || 0), 0)}/
                    {group.reduce((total, room) => total + (roomReservation(room)?.children || 0), 0)}
                  </td>
                  <td colSpan={8} />
                </tr>
                {group.map((room) => {
                  const reservation = roomReservation(room);
                  const task = roomTask(room);
                  return (
                  <tr key={room.id}>
                    <td><input type="checkbox" /></td>
                    <td>{room.roomNumber}</td>
                    <td>{reservation ? `${reservation.adults}/${reservation.children}` : '0/0'}</td>
                    <td>
                      <select
                        className={`house-select ${room.housekeepingStatus}`}
                        value={room.housekeepingStatus}
                        onChange={(event) => updateHouseStatus(room, event.target.value as Room['housekeepingStatus'])}
                      >
                        <option value="dirty">Dirty</option>
                        <option value="clean">Clean</option>
                        <option value="inspected">Inspected</option>
                        <option value="out_of_order">Out of Order</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="assignee-select"
                        value={task?.assignedTo || ''}
                        onChange={(event) => updateAssignee(room, event.target.value)}
                      >
                        <option value="">Not Assigned</option>
                        <option value="Sasi">Sasi</option>
                        <option value="Front Desk">Front Desk</option>
                      </select>
                    </td>
                    <td>{roomMovementStatus(room, reservation)}</td>
                    <td>{reservation ? dateLabel(reservation.checkIn, 'hh:mm a') : '-'}</td>
                    <td>{reservation ? dateLabel(reservation.checkIn) : '-'}</td>
                    <td>{reservation ? dateLabel(reservation.checkOut) : '-'}</td>
                    <td>{reservation ? nights(reservation) : '-'}</td>
                    <td>
                      <button
                        className="icon-button"
                        onClick={async () => {
                          const notes = window.prompt('Room remarks', room.notes || '');
                          if (notes === null) return;
                          await pmsService.updateRoom(room.id, { notes });
                          load();
                        }}
                      >
                        <Pencil size={17} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {drawer && (
        <div className="drawer-backdrop">
          <aside className="side-drawer">
            <div className="drawer-head">
              <h2>{drawer === 'settings' ? 'Housekeeping Settings' : 'Housekeeping Audit'}</h2>
              <button className="icon-button" onClick={() => setDrawer(null)}><X size={22} /></button>
            </div>
            {drawer === 'settings' ? (
              <div className="metric-list">
                <div className="drawer-item"><span>Clean</span><strong>{rooms.filter((room) => room.housekeepingStatus === 'clean').length}</strong></div>
                <div className="drawer-item"><span>Dirty</span><strong>{rooms.filter((room) => room.housekeepingStatus === 'dirty').length}</strong></div>
                <div className="drawer-item"><span>Inspected</span><strong>{rooms.filter((room) => room.housekeepingStatus === 'inspected').length}</strong></div>
                <div className="drawer-item"><span>Out of Order</span><strong>{rooms.filter((room) => room.housekeepingStatus === 'out_of_order').length}</strong></div>
              </div>
            ) : (
              <div className="drawer-list">
                {tasks.map((task) => (
                  <div className="drawer-item" key={task.id}>
                    Room {task.room?.roomNumber || task.roomId}: {task.taskType} is {task.status}, assigned to {task.assignedTo || 'nobody'}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default HouseStatus;
