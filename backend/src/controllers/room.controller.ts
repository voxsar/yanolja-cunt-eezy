import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Room, RoomType, Reservation, HousekeepingTask } from '../models';
import { Op } from 'sequelize';

export const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await Room.findAll({
      include: [{
        model: RoomType,
        as: 'roomType'
      }],
      order: [['roomNumber', 'ASC']]
    });

    res.json({ rooms });
  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoomById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id, {
      include: [{
        model: RoomType,
        as: 'roomType'
      }]
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomNumber, roomTypeId, floor, status, housekeepingStatus, notes } = req.body;

    if (!roomNumber || !roomTypeId) {
      return res.status(400).json({ message: 'Room number and room type are required' });
    }

    const room = await Room.create({
      roomNumber,
      roomTypeId,
      floor,
      status,
      housekeepingStatus,
      notes
    });

    res.status(201).json({ room });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.update(req.body);
    res.json({ room });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.destroy();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoomAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { checkIn, checkOut, roomTypeId } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }

    const whereClause: any = {};
    if (roomTypeId) {
      whereClause.roomTypeId = roomTypeId;
    }

    const bookedRoomIds = await Reservation.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'checked_in']
        },
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [new Date(checkIn as string), new Date(checkOut as string)]
            }
          },
          {
            checkOut: {
              [Op.between]: [new Date(checkIn as string), new Date(checkOut as string)]
            }
          },
          {
            [Op.and]: [
              { checkIn: { [Op.lte]: new Date(checkIn as string) } },
              { checkOut: { [Op.gte]: new Date(checkOut as string) } }
            ]
          }
        ]
      },
      attributes: ['roomId']
    });

    whereClause.id = {
      [Op.notIn]: bookedRoomIds.map(r => r.roomId).filter(id => id !== null)
    };
    whereClause.status = 'available';
    whereClause.housekeepingStatus = {
      [Op.ne]: 'out_of_order'
    };

    const availableRooms = await Room.findAll({
      where: whereClause,
      include: [{
        model: RoomType,
        as: 'roomType'
      }]
    });

    res.json({ availableRooms });
  } catch (error) {
    console.error('Get room availability error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
