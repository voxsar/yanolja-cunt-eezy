export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'front_desk' | 'housekeeping' | 'manager';
  firstName?: string;
  lastName?: string;
}

export interface RoomType {
  id: number;
  name: string;
  code: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  isActive: boolean;
}

export interface Room {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  floor?: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'blocked';
  housekeepingStatus: 'clean' | 'dirty' | 'inspected' | 'out_of_order';
  notes?: string;
  roomType?: RoomType;
}

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  company?: string;
  isVIP: boolean;
  notes?: string;
}

export interface Reservation {
  id: number;
  reservationNumber: string;
  guestId: number;
  roomId?: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  source: string;
  businessSource?: string;
  salesPerson?: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  rateType?: string;
  specialRequests?: string;
  notes?: string;
  guest?: Guest;
  room?: Room;
  roomType?: RoomType;
}

export interface HousekeepingTask {
  id: number;
  roomId: number;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  taskType: 'cleaning' | 'inspection' | 'maintenance';
  notes?: string;
  completedAt?: string;
  room?: Room;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  arrivalsToday: number;
  departuresToday: number;
  inHouseGuests: number;
  occupancyRate: number;
  monthlyRevenue: number;
  dirtyRooms: number;
}

export interface BusinessSource {
  id: number;
  shortCode: string;
  name: string;
  color?: string;
  status: 'active' | 'inactive';
}

export interface Promotion {
  id: number;
  title: string;
  category: string;
  promotionType: string;
  desktopDiscount: number;
  mobileDiscount: number;
  code?: string;
  bookingStart: string;
  bookingEnd: string;
  status: 'active' | 'inactive';
}

export interface ChannelLog {
  id: number;
  source: string;
  forDate: string;
  operation: string;
  roomType?: string;
  ratePlan?: string;
  requestAt: string;
  processedAt?: string;
  updatedValue?: string;
  user?: string;
}

export interface ChannelMessageSetting {
  id: number;
  channelName: string;
  autoMode: boolean;
  customMessage: string;
}

export interface PaymentGatewaySetting {
  id: number;
  paymentType: string;
  paymentCaption: string;
  userId: string;
  password: string;
  merchantId: string;
  gatewayUrl: string;
  enabled: boolean;
  linkSettings: Record<string, {
    manualMode: boolean;
    autoMode: boolean;
    depositAmount: number | null;
  }>;
}

export interface GuestPortalRequest {
  id: number;
  reservationNumber: string;
  guestName: string;
  date: string;
  room?: string;
  request: string;
  bookingStatus: string;
  status: 'open' | 'in_progress' | 'closed';
}

export interface Folio {
  id: number;
  folioNumber: string;
  reservationNumber: string;
  guestName: string;
  arrival: string;
  departure: string;
  status: 'open' | 'settled' | 'void';
  balance: number;
}

export interface OperationalSnapshot {
  startDate: string;
  days: number;
  roomTypes: RoomType[];
  rooms: Room[];
  reservations: Reservation[];
}
