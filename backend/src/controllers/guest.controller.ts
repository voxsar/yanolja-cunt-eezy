import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Guest, Reservation } from '../models';
import { Op } from 'sequelize';

export const getAllGuests = async (req: AuthRequest, res: Response) => {
  try {
    const { search, country, isVIP } = req.query;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } }
      ];
    }

    if (country) {
      where.country = country;
    }

    if (isVIP !== undefined) {
      where.isVIP = isVIP === 'true';
    }

    const guests = await Guest.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({ guests });
  } catch (error) {
    console.error('Get all guests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGuestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByPk(id, {
      include: [{
        model: Reservation,
        as: 'reservations',
        order: [['checkIn', 'DESC']]
      }]
    });

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.json({ guest });
  } catch (error) {
    console.error('Get guest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createGuest = async (req: AuthRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      title,
      email,
      phone,
      mobile,
      country,
      address,
      city,
      state,
      zipCode,
      nationality,
      idType,
      idNumber,
      company,
      isVIP,
      notes
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const guest = await Guest.create({
      firstName,
      lastName,
      title,
      email,
      phone,
      mobile,
      country,
      address,
      city,
      state,
      zipCode,
      nationality,
      idType,
      idNumber,
      company,
      isVIP: isVIP || false,
      notes
    });

    res.status(201).json({ guest });
  } catch (error) {
    console.error('Create guest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateGuest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByPk(id);

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    await guest.update(req.body);
    res.json({ guest });
  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteGuest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByPk(id);

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // Check if guest has reservations
    const reservationCount = await Reservation.count({ where: { guestId: id } });
    if (reservationCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete guest with existing reservations'
      });
    }

    await guest.destroy();
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
