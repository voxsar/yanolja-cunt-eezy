import {
  BusinessSource,
  ChannelLog,
  ChannelMessageSetting,
  Folio,
  Guest,
  GuestPortalRequest,
  HousekeepingTask,
  PaymentGatewaySetting,
  Promotion,
  Reservation,
  Room,
  RoomType,
  User
} from '../models';

const sourceRows = [
  ['BEYOND ESCAPES PRIVATE LIMITED', 'BEYOND ESCAPES PRIVATE LIMITED', null],
  ['Ceylon Escapade Partnets', 'Ceylon Escapade Partnets', null],
  ['Aitken Spence Travels (Pvt) Ltd', 'Aitken Spence Travels (Pvt) Ltd', null],
  ['Saffron Island Destination Management (Pvt) Ltd', 'Saffron Island Destination Management (Pvt) Ltd', null],
  ['Antiquity', 'Antiquity', null],
  ['Scenic Destinations', 'Scenic Destinations', null],
  ['Connaissance De Ceylon', 'Connaissance De Ceylon', null],
  ['Travel Treasures Sri Lanka', 'Travel Treasures Sri Lanka', null],
  ['Jetwing Eco Holidays', 'Jetwing Eco Holidays', null],
  ['Ceylon Tours Ltd', 'Ceylon Tours Ltd', null],
  ['TG', 'Tamala Group', '#c032c9'],
  ['tf', 'TRIP FUSION', '#666666'],
  ['TA', 'TRIPFUSION (PVT) LTD', '#666666'],
  ['CN', 'Connaissance De Ceylan', '#666666'],
  ['Pearl Destinations', 'Pearl Destinations', null],
  ['Silan Travel -The Signature Collection', 'Silan Travel -The Signature Collection', null]
];

export const seedDemoData = async () => {
  const userCount = await User.count();
  if (userCount === 0) {
    await User.create({
      username: 'admin',
      email: 'admin@fifiresorts.test',
      password: 'admin123',
      role: 'admin',
      firstName: 'Fifi',
      lastName: 'Admin',
      isActive: true
    });
  }

  if ((await RoomType.count()) === 0) {
    await RoomType.bulkCreate([
      { name: 'Mount Monarch', code: 'MON', basePrice: 225, maxOccupancy: 2, isActive: true },
      { name: 'Mount Luxe', code: 'LUX', basePrice: 225, maxOccupancy: 2, isActive: true },
      { name: 'Sunrise Vista', code: 'SV', basePrice: 139, maxOccupancy: 3, isActive: true },
      { name: 'Eco Harmony', code: 'ECO', basePrice: 119, maxOccupancy: 2, isActive: true },
      { name: 'Forest Escape Suite', code: 'FAM', basePrice: 0, maxOccupancy: 5, isActive: true },
      { name: 'Default Unmapped Room', code: 'DUR', basePrice: 0, maxOccupancy: 0, isActive: true }
    ]);
  }

  if ((await Room.count()) === 0) {
    const roomTypes = await RoomType.findAll({ order: [['id', 'ASC']] });
    await Room.bulkCreate([
      { roomNumber: 'Mount Monarch Chalet-C01', roomTypeId: roomTypes[0].id, floor: 1, status: 'occupied', housekeepingStatus: 'dirty' },
      { roomNumber: 'Mount Luxe Chalet-C02', roomTypeId: roomTypes[1].id, floor: 1, status: 'reserved', housekeepingStatus: 'dirty' },
      { roomNumber: 'Sunrise Vista Suite-S01', roomTypeId: roomTypes[2].id, floor: 1, status: 'available', housekeepingStatus: 'dirty' },
      { roomNumber: 'Eco Harmony Suite-S03', roomTypeId: roomTypes[3].id, floor: 1, status: 'available', housekeepingStatus: 'dirty' },
      { roomNumber: 'Family Suite-S02', roomTypeId: roomTypes[4].id, floor: 1, status: 'available', housekeepingStatus: 'dirty' }
    ]);
  }

  if ((await Guest.count()) === 0) {
    await Guest.bulkCreate([
      { title: 'Ms.', firstName: 'Tharu', lastName: 'Munasinghe', mobile: '+94 77 100 2000', email: 'tharu@example.com', country: 'Sri Lanka', isVIP: false },
      { title: 'Mr.', firstName: 'Shathishka', lastName: 'Bandara', mobile: '+94 77 200 3000', email: 'shathishka@example.com', country: 'Sri Lanka', isVIP: false },
      { title: 'Mr.', firstName: 'Shan', lastName: 'Perera', mobile: '+94 77 300 4000', email: 'shan@example.com', country: 'Sri Lanka', isVIP: true },
      { title: 'Ms.', firstName: 'Sanduni', lastName: 'Diwyanjali', mobile: '+94 77 400 5000', email: 'sanduni@example.com', country: 'Sri Lanka', isVIP: false },
      { title: 'Mr.', firstName: 'Kasun', lastName: 'Fernando', mobile: '+94 77 500 6000', email: 'kasun@example.com', country: 'Sri Lanka', isVIP: false }
    ]);
  }

  if ((await Reservation.count()) === 0) {
    const [rooms, guests] = await Promise.all([
      Room.findAll({ order: [['id', 'ASC']] }),
      Guest.findAll({ order: [['id', 'ASC']] })
    ]);

    await Reservation.bulkCreate([
      {
        reservationNumber: 'RES000001',
        guestId: guests[0].id,
        roomId: rooms[0].id,
        roomTypeId: rooms[0].roomTypeId,
        checkIn: new Date('2026-05-05T10:13:00'),
        checkOut: new Date('2026-05-06T11:00:00'),
        adults: 2,
        children: 0,
        status: 'checked_in',
        source: 'direct',
        businessSource: 'Direct',
        salesPerson: 'Sasi',
        totalAmount: 225,
        paidAmount: 100,
        balanceAmount: 125,
        rateType: 'FB'
      },
      {
        reservationNumber: 'RES000002',
        guestId: guests[1].id,
        roomId: rooms[1].id,
        roomTypeId: rooms[1].roomTypeId,
        checkIn: new Date('2026-05-08T14:00:00'),
        checkOut: new Date('2026-05-09T11:00:00'),
        adults: 2,
        children: 0,
        status: 'confirmed',
        source: 'booking_engine',
        businessSource: 'Web Offer',
        salesPerson: 'Sasi',
        totalAmount: 225,
        paidAmount: 0,
        balanceAmount: 225,
        rateType: 'BB'
      },
      {
        reservationNumber: 'RES000003',
        guestId: guests[2].id,
        roomId: rooms[2].id,
        roomTypeId: rooms[2].roomTypeId,
        checkIn: new Date('2026-05-09T14:00:00'),
        checkOut: new Date('2026-05-11T11:00:00'),
        adults: 2,
        children: 0,
        status: 'confirmed',
        source: 'airbnb',
        businessSource: 'Affiliate Influencer',
        salesPerson: 'Sasi',
        totalAmount: 278,
        paidAmount: 278,
        balanceAmount: 0,
        rateType: 'FB'
      },
      {
        reservationNumber: 'RES000004',
        guestId: guests[3].id,
        roomId: rooms[3].id,
        roomTypeId: rooms[3].roomTypeId,
        checkIn: new Date('2026-05-14T14:00:00'),
        checkOut: new Date('2026-05-16T11:00:00'),
        adults: 2,
        children: 0,
        status: 'confirmed',
        source: 'booking_com',
        businessSource: 'Tamala Group',
        salesPerson: 'Sasi',
        totalAmount: 238,
        paidAmount: 0,
        balanceAmount: 238,
        rateType: 'FB'
      },
      {
        reservationNumber: 'RES000005',
        guestId: guests[4].id,
        roomId: rooms[0].id,
        roomTypeId: rooms[0].roomTypeId,
        checkIn: new Date('2026-05-16T14:00:00'),
        checkOut: new Date('2026-05-17T11:00:00'),
        adults: 2,
        children: 0,
        status: 'confirmed',
        source: 'phone',
        businessSource: 'Direct',
        salesPerson: 'Front Desk',
        totalAmount: 225,
        paidAmount: 0,
        balanceAmount: 225,
        rateType: 'FB'
      }
    ]);

    await HousekeepingTask.bulkCreate(
      rooms.map((room, index) => ({
        roomId: room.id,
        assignedTo: index < 2 ? 'Sasi' : undefined,
        status: 'pending',
        priority: index < 2 ? 'high' : 'medium',
        taskType: 'cleaning',
        notes: index < 2 ? 'Guest movement expected today' : 'Standard turnover clean'
      }))
    );
  }

  if ((await BusinessSource.count()) === 0) {
    await BusinessSource.bulkCreate(
      sourceRows.map(([shortCode, name, color]) => ({
        shortCode: shortCode as string,
        name: name as string,
        color: color as string | undefined,
        status: 'active'
      }))
    );
  }

  if ((await Promotion.count()) === 0) {
    await Promotion.bulkCreate([
      { title: 'Direct Offer Deal', category: 'Basic Package', promotionType: 'Percent Discount', desktopDiscount: 25, mobileDiscount: 25, bookingStart: new Date('2025-12-26'), bookingEnd: new Date('2026-11-30'), status: 'active' },
      { title: 'Web Offer', category: 'Booking Engine Promotion', promotionType: 'Percent Discount', desktopDiscount: 20, mobileDiscount: 20, code: 'Web20', bookingStart: new Date('2024-03-18'), bookingEnd: new Date('2024-10-31'), status: 'active' },
      { title: 'Affiliate Influencer', category: 'Booking Engine Promotion', promotionType: 'Percent Discount', desktopDiscount: 30, mobileDiscount: 30, code: 'THC30', bookingStart: new Date('2023-08-30'), bookingEnd: new Date('2023-09-01'), status: 'active' }
    ]);
  }

  if ((await ChannelMessageSetting.count()) === 0) {
    await ChannelMessageSetting.bulkCreate([
      {
        channelName: 'Airbnb',
        autoMode: true,
        customMessage: 'Thank you for getting in touch with us. We will get back to you shortly.'
      }
    ]);
  }

  if ((await PaymentGatewaySetting.count()) === 0) {
    await PaymentGatewaySetting.create({
      paymentType: 'Mpgs',
      paymentCaption: 'Credit card ( via Mpgs )',
      userId: 'merchant.MPGS00000062',
      password: 'acf47321744ba2e6ad42c4fbefad2212',
      merchantId: 'MPGS00000062',
      gatewayUrl: 'seylan.gateway.mastercard.com',
      enabled: true,
      linkSettings: {
        'Booking Engine + PMS': { manualMode: true, autoMode: false, depositAmount: null },
        Airbnb: { manualMode: false, autoMode: false, depositAmount: null },
        'Booking.com': { manualMode: false, autoMode: false, depositAmount: null },
        Expedia: { manualMode: false, autoMode: false, depositAmount: null }
      }
    });
  }

  if ((await ChannelLog.count()) === 0) {
    await ChannelLog.create({
      source: 'Booking.com',
      forDate: new Date('2026-05-05'),
      operation: 'Inventory Sync',
      roomType: 'Mount Monarch',
      ratePlan: 'FB',
      requestAt: new Date('2026-05-05T07:21:00'),
      processedAt: new Date('2026-05-05T07:21:10'),
      updatedValue: 'Available inventory: 4',
      user: 'system'
    });
  }

  if ((await GuestPortalRequest.count()) === 0) {
    await GuestPortalRequest.bulkCreate([
      {
        reservationNumber: 'RES000004',
        guestName: 'Ms. Sanduni Diwyanjali',
        date: new Date('2026-05-13'),
        room: 'Eco Harmony Suite-S03',
        request: 'Late check-in confirmation',
        bookingStatus: 'Confirmed',
        status: 'open'
      }
    ]);
  }

  if ((await Folio.count()) === 0) {
    await Folio.bulkCreate([
      {
        folioNumber: 'FOL000001',
        reservationNumber: 'RES000001',
        guestName: 'Ms. Tharu Munasinghe',
        arrival: new Date('2026-05-05'),
        departure: new Date('2026-05-06'),
        status: 'open',
        balance: 125
      },
      {
        folioNumber: 'FOL000004',
        reservationNumber: 'RES000004',
        guestName: 'Ms. Sanduni Diwyanjali',
        arrival: new Date('2026-05-14'),
        departure: new Date('2026-05-16'),
        status: 'open',
        balance: 238
      }
    ]);
  }
};
