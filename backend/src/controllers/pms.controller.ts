import { Response } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  BusinessSource,
  ChannelLog,
  ChannelMessageSetting,
  Folio,
  GuestPortalRequest,
  PaymentGatewaySetting,
  Promotion,
  Reservation,
  Room,
  RoomType,
  Guest
} from '../models';

export const getOperationalSnapshot = async (req: AuthRequest, res: Response) => {
  try {
    const start = new Date((req.query.startDate as string) || new Date());
    const days = Math.min(parseInt((req.query.days as string) || '20', 10), 45);
    const end = new Date(start);
    end.setDate(start.getDate() + days);

    const [roomTypes, rooms, reservations] = await Promise.all([
      RoomType.findAll({ where: { isActive: true }, order: [['id', 'ASC']] }),
      Room.findAll({
        include: [{ model: RoomType, as: 'roomType' }],
        order: [['roomTypeId', 'ASC'], ['roomNumber', 'ASC']]
      }),
      Reservation.findAll({
        where: {
          status: { [Op.in]: ['pending', 'confirmed', 'checked_in'] },
          [Op.and]: [
            { checkIn: { [Op.lt]: end } },
            { checkOut: { [Op.gt]: start } }
          ]
        },
        include: [
          { model: Guest, as: 'guest' },
          { model: Room, as: 'room', required: false },
          { model: RoomType, as: 'roomType' }
        ],
        order: [['checkIn', 'ASC']]
      })
    ]);

    res.json({ startDate: start, days, roomTypes, rooms, reservations });
  } catch (error) {
    console.error('Get operational snapshot error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listBusinessSources = async (req: AuthRequest, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const where = search
      ? {
          [Op.or]: [
            { shortCode: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};
    const businessSources = await BusinessSource.findAll({
      where,
      order: [['name', 'ASC']]
    });
    res.json({ businessSources });
  } catch (error) {
    console.error('List business sources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createBusinessSource = async (req: AuthRequest, res: Response) => {
  try {
    const { shortCode, name, color, status } = req.body;
    if (!shortCode || !name) {
      return res.status(400).json({ message: 'Short code and business source name are required' });
    }
    const businessSource = await BusinessSource.create({
      shortCode,
      name,
      color,
      status: status || 'active'
    });
    res.status(201).json({ businessSource });
  } catch (error) {
    console.error('Create business source error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBusinessSource = async (req: AuthRequest, res: Response) => {
  try {
    const businessSource = await BusinessSource.findByPk(req.params.id);
    if (!businessSource) {
      return res.status(404).json({ message: 'Business source not found' });
    }
    await businessSource.update(req.body);
    res.json({ businessSource });
  } catch (error) {
    console.error('Update business source error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listPromotions = async (req: AuthRequest, res: Response) => {
  try {
    const status = (req.query.status as string) || 'active';
    const promotions = await Promotion.findAll({
      where: status === 'all' ? {} : { status },
      order: [['bookingEnd', 'DESC']]
    });
    res.json({ promotions });
  } catch (error) {
    console.error('List promotions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPromotion = async (req: AuthRequest, res: Response) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json({ promotion });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listChannelLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { source, operation, roomType, ratePlan, forDate } = req.query;
    const where: any = {};
    if (source) where.source = source;
    if (operation) where.operation = operation;
    if (roomType) where.roomType = roomType;
    if (ratePlan) where.ratePlan = ratePlan;
    if (forDate) where.forDate = forDate;

    const channelLogs = await ChannelLog.findAll({
      where,
      order: [['requestAt', 'DESC']]
    });
    res.json({ channelLogs });
  } catch (error) {
    console.error('List channel logs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listChannelMessageSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await ChannelMessageSetting.findAll({ order: [['channelName', 'ASC']] });
    res.json({ settings });
  } catch (error) {
    console.error('List channel message settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateChannelMessageSetting = async (req: AuthRequest, res: Response) => {
  try {
    const setting = await ChannelMessageSetting.findByPk(req.params.id);
    if (!setting) {
      return res.status(404).json({ message: 'Channel setting not found' });
    }
    await setting.update(req.body);
    res.json({ setting });
  } catch (error) {
    console.error('Update channel message setting error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listPaymentGatewaySettings = async (req: AuthRequest, res: Response) => {
  try {
    const gateways = await PaymentGatewaySetting.findAll({ order: [['paymentType', 'ASC']] });
    res.json({ gateways });
  } catch (error) {
    console.error('List payment gateway settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePaymentGatewaySetting = async (req: AuthRequest, res: Response) => {
  try {
    const gateway = await PaymentGatewaySetting.findByPk(req.params.id);
    if (!gateway) {
      return res.status(404).json({ message: 'Payment gateway not found' });
    }
    await gateway.update(req.body);
    res.json({ gateway });
  } catch (error) {
    console.error('Update payment gateway setting error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listGuestPortalRequests = async (req: AuthRequest, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const where = search
      ? {
          [Op.or]: [
            { reservationNumber: { [Op.like]: `%${search}%` } },
            { guestName: { [Op.like]: `%${search}%` } },
            { request: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};
    const requests = await GuestPortalRequest.findAll({
      where,
      order: [['date', 'DESC']]
    });
    res.json({ requests });
  } catch (error) {
    console.error('List guest portal requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listFolios = async (req: AuthRequest, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const where: any = {
      status: 'open',
      balance: { [Op.gt]: 0 }
    };

    if (search) {
      where[Op.or] = [
        { folioNumber: { [Op.like]: `%${search}%` } },
        { reservationNumber: { [Op.like]: `%${search}%` } },
        { guestName: { [Op.like]: `%${search}%` } }
      ];
    }

    const folios = await Folio.findAll({
      where,
      order: [['departure', 'ASC']]
    });
    res.json({ folios });
  } catch (error) {
    console.error('List folios error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
