import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Room, Reservation, Guest, RoomType } from '../models';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total rooms
    const totalRooms = await Room.count();

    // Available rooms
    const availableRooms = await Room.count({
      where: {
        status: 'available',
        housekeepingStatus: 'clean'
      }
    });

    // Occupied rooms
    const occupiedRooms = await Room.count({
      where: {
        status: 'occupied'
      }
    });

    // Today's arrivals
    const arrivalsToday = await Reservation.count({
      where: {
        checkIn: {
          [Op.between]: [today, tomorrow]
        },
        status: {
          [Op.in]: ['confirmed', 'checked_in']
        }
      }
    });

    // Today's departures
    const departuresToday = await Reservation.count({
      where: {
        checkOut: {
          [Op.between]: [today, tomorrow]
        },
        status: 'checked_in'
      }
    });

    // In-house guests
    const inHouseGuests = await Reservation.count({
      where: {
        status: 'checked_in'
      }
    });

    // Occupancy rate
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0;

    // Revenue for current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyRevenue = await Reservation.sum('totalAmount', {
      where: {
        checkIn: {
          [Op.between]: [startOfMonth, endOfMonth]
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    }) || 0;

    // Upcoming arrivals (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingArrivals = await Reservation.findAll({
      where: {
        checkIn: {
          [Op.between]: [today, nextWeek]
        },
        status: 'confirmed'
      },
      include: [
        { model: Guest, as: 'guest' },
        { model: Room, as: 'room', required: false },
        { model: RoomType, as: 'roomType' }
      ],
      order: [['checkIn', 'ASC']],
      limit: 10
    });

    // Dirty rooms needing cleaning
    const dirtyRooms = await Room.count({
      where: {
        housekeepingStatus: 'dirty'
      }
    });

    res.json({
      stats: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        arrivalsToday,
        departuresToday,
        inHouseGuests,
        occupancyRate: parseFloat(occupancyRate as string),
        monthlyRevenue: parseFloat(monthlyRevenue as any),
        dirtyRooms
      },
      upcomingArrivals
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOccupancyReport = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const totalRooms = await Room.count();

    const occupancyData = await Reservation.findAll({
      where: {
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
            }
          },
          {
            checkOut: {
              [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
            }
          }
        ],
        status: {
          [Op.in]: ['checked_in', 'checked_out']
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('check_in')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'reservations']
      ],
      group: [sequelize.fn('DATE', sequelize.col('check_in'))],
      raw: true
    });

    res.json({
      totalRooms,
      occupancyData
    });
  } catch (error) {
    console.error('Get occupancy report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
