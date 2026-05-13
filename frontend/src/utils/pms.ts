import { addDays, differenceInCalendarDays, format, isBefore, isEqual, isSameDay, parseISO } from 'date-fns';
import { Reservation, Room } from '../types';

export const money = (value: number | string | undefined) => Number(value || 0).toFixed(2);

export const dateLabel = (value: string | Date, pattern = 'dd/MM/yyyy') =>
  format(typeof value === 'string' ? parseISO(value) : value, pattern);

export const daysFrom = (startDate: string, count: number) =>
  Array.from({ length: count }, (_, index) => addDays(parseISO(startDate), index));

export const todayIso = () => format(new Date(), 'yyyy-MM-dd');

export const addIsoDays = (date: string, count: number) => format(addDays(parseISO(date), count), 'yyyy-MM-dd');

export const sameIsoDay = (value: string | Date, day: string | Date) =>
  isSameDay(typeof value === 'string' ? parseISO(value) : value, typeof day === 'string' ? parseISO(day) : day);

export const guestName = (reservation: Reservation) => {
  if (!reservation.guest) return 'Unassigned Guest';
  return `${reservation.guest.title ? `${reservation.guest.title} ` : ''}${reservation.guest.firstName} ${reservation.guest.lastName}`;
};

export const reservationTouchesDay = (reservation: Reservation, day: Date) => {
  const checkIn = parseISO(reservation.checkIn);
  const checkOut = parseISO(reservation.checkOut);
  return (isEqual(day, checkIn) || isBefore(checkIn, day)) && isBefore(day, checkOut);
};

export const reservationStartsDay = (reservation: Reservation, day: Date) => {
  const checkIn = parseISO(reservation.checkIn);
  return format(checkIn, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
};

export const nights = (reservation: Reservation) =>
  Math.max(1, differenceInCalendarDays(parseISO(reservation.checkOut), parseISO(reservation.checkIn)));

export const roomCode = (room: Room) => room.roomNumber.split('-').pop() || room.roomNumber;
