import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Reservation, Guest, Room, RoomType } from '../models';
import { Op } from 'sequelize';

export const getAllReservations = async (req: AuthRequest, res: Response) => {
  try {
    const { status, checkIn, checkOut, guestName } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (checkIn && checkOut) {
      where[Op.or] = [
        {
          checkIn: {
            [Op.between]: [new Date(checkIn as string), new Date(checkOut as string)]
          }
        },
        {
          checkOut: {
            [Op.between]: [new Date(checkIn as string), new Date(checkOut as string)]
          }
        }
      ];
    }

    const reservations = await Reservation.findAll({
      where,
      include: [
        {
          model: Guest,
          as: 'guest',
          ...(guestName && {
            where: {
              [Op.or]: [
                { firstName: { [Op.like]: `%${guestName}%` } },
                { lastName: { [Op.like]: `%${guestName}%` } }
              ]
            }
          })
        },
        {
          model: Room,
          as: 'room',
          required: false
        },
        {
          model: RoomType,
          as: 'roomType'
        }
      ],
      order: [['checkIn', 'ASC']]
    });

    res.json({ reservations });
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReservationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room', required: false },
        { model: RoomType, as: 'roomType' }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json({ reservation });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createReservation = async (req: AuthRequest, res: Response) => {
  try {
    const {
      guestId,
      roomId,
      roomTypeId,
      checkIn,
      checkOut,
      adults,
      children,
      source,
      businessSource,
      salesPerson,
      totalAmount,
      paidAmount,
      rateType,
      specialRequests,
      notes
    } = req.body;

    if (!guestId || !roomTypeId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: 'Guest, room type, check-in, and check-out are required'
      });
    }

    // Generate reservation number
    const count = await Reservation.count();
    const reservationNumber = `RES${String(count + 1).padStart(6, '0')}`;

    const balanceAmount = (totalAmount || 0) - (paidAmount || 0);

    const reservation = await Reservation.create({
      reservationNumber,
      guestId,
      roomId,
      roomTypeId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults: adults || 1,
      children: children || 0,
      status: 'confirmed',
      source: source || 'direct',
      businessSource,
      salesPerson,
      totalAmount: totalAmount || 0,
      paidAmount: paidAmount || 0,
      balanceAmount,
      rateType,
      specialRequests,
      notes
    });

    // Update room status if room is assigned
    if (roomId) {
      await Room.update(
        { status: 'reserved' },
        { where: { id: roomId } }
      );
    }

    const createdReservation = await Reservation.findByPk(reservation.id, {
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room', required: false },
        { model: RoomType, as: 'roomType' }
      ]
    });

    res.status(201).json({ reservation: createdReservation });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const oldRoomId = reservation.roomId;
    await reservation.update(req.body);

    // Update room statuses if room assignment changed
    if (req.body.roomId && oldRoomId !== req.body.roomId) {
      if (oldRoomId) {
        await Room.update({ status: 'available' }, { where: { id: oldRoomId } });
      }
      await Room.update({ status: 'reserved' }, { where: { id: req.body.roomId } });
    }

    const updatedReservation = await Reservation.findByPk(id, {
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room', required: false },
        { model: RoomType, as: 'roomType' }
      ]
    });

    res.json({ reservation: updatedReservation });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed reservations can be checked in' });
    }

    await reservation.update({ status: 'checked_in' });

    if (reservation.roomId) {
      await Room.update(
        { status: 'occupied', housekeepingStatus: 'dirty' },
        { where: { id: reservation.roomId } }
      );
    }

    res.json({ reservation, message: 'Check-in successful' });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status !== 'checked_in') {
      return res.status(400).json({ message: 'Only checked-in reservations can be checked out' });
    }

    await reservation.update({ status: 'checked_out' });

    if (reservation.roomId) {
      await Room.update(
        { status: 'available', housekeepingStatus: 'dirty' },
        { where: { id: reservation.roomId } }
      );
    }

    res.json({ reservation, message: 'Check-out successful' });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.status === 'checked_in' || reservation.status === 'checked_out') {
      return res.status(400).json({
        message: 'Cannot cancel checked-in or checked-out reservations'
      });
    }

    await reservation.update({ status: 'cancelled' });

    if (reservation.roomId) {
      await Room.update({ status: 'available' }, { where: { id: reservation.roomId } });
    }

    res.json({ reservation, message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
