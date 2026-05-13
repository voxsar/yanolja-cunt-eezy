import api from './api';
import {
  BusinessSource,
  ChannelLog,
  ChannelMessageSetting,
  Folio,
  Guest,
  GuestPortalRequest,
  HousekeepingTask,
  OperationalSnapshot,
  PaymentGatewaySetting,
  Promotion,
  Reservation,
  Room
} from '../types';

export const pmsService = {
  snapshot: async (startDate = new Date().toISOString().slice(0, 10), days = 20): Promise<OperationalSnapshot> => {
    const response = await api.get('/pms/snapshot', { params: { startDate, days } });
    return response.data;
  },

  rooms: async (): Promise<Room[]> => {
    const response = await api.get('/rooms');
    return response.data.rooms;
  },

  reservations: async (params?: Record<string, string>): Promise<Reservation[]> => {
    const response = await api.get('/reservations', { params });
    return response.data.reservations;
  },

  guests: async (search?: string): Promise<Guest[]> => {
    const response = await api.get('/guests', { params: search ? { search } : undefined });
    return response.data.guests;
  },

  createGuest: async (payload: Partial<Guest>): Promise<Guest> => {
    const response = await api.post('/guests', payload);
    return response.data.guest;
  },

  createReservation: async (payload: Record<string, unknown>): Promise<Reservation> => {
    const response = await api.post('/reservations', payload);
    return response.data.reservation;
  },

  updateReservation: async (id: number, payload: Partial<Reservation>): Promise<Reservation> => {
    const response = await api.put(`/reservations/${id}`, payload);
    return response.data.reservation;
  },

  availableRooms: async (checkIn: string, checkOut: string, roomTypeId?: string): Promise<Room[]> => {
    const response = await api.get('/rooms/availability', {
      params: {
        checkIn,
        checkOut,
        ...(roomTypeId ? { roomTypeId } : {})
      }
    });
    return response.data.availableRooms;
  },

  houseStatus: async (): Promise<{ rooms: Room[]; statusCounts: Record<string, number>; total: number }> => {
    const response = await api.get('/housekeeping/house-status');
    return response.data;
  },

  housekeepingTasks: async (): Promise<HousekeepingTask[]> => {
    const response = await api.get('/housekeeping/tasks');
    return response.data.tasks;
  },

  createHousekeepingTask: async (payload: Partial<HousekeepingTask>): Promise<HousekeepingTask> => {
    const response = await api.post('/housekeeping/tasks', payload);
    return response.data.task;
  },

  updateHousekeepingTask: async (id: number, payload: Partial<HousekeepingTask>): Promise<HousekeepingTask> => {
    const response = await api.put(`/housekeeping/tasks/${id}`, payload);
    return response.data.task;
  },

  updateRoom: async (id: number, payload: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, payload);
    return response.data.room;
  },

  businessSources: async (search?: string): Promise<BusinessSource[]> => {
    const response = await api.get('/pms/business-sources', { params: search ? { search } : undefined });
    return response.data.businessSources;
  },

  createBusinessSource: async (payload: Partial<BusinessSource>): Promise<BusinessSource> => {
    const response = await api.post('/pms/business-sources', payload);
    return response.data.businessSource;
  },

  updateBusinessSource: async (id: number, payload: Partial<BusinessSource>): Promise<BusinessSource> => {
    const response = await api.put(`/pms/business-sources/${id}`, payload);
    return response.data.businessSource;
  },

  promotions: async (status = 'active'): Promise<Promotion[]> => {
    const response = await api.get('/pms/promotions', { params: { status } });
    return response.data.promotions;
  },

  createPromotion: async (payload: Partial<Promotion>): Promise<Promotion> => {
    const response = await api.post('/pms/promotions', payload);
    return response.data.promotion;
  },

  channelLogs: async (params?: Record<string, string>): Promise<ChannelLog[]> => {
    const response = await api.get('/pms/channel-logs', { params });
    return response.data.channelLogs;
  },

  channelMessageSettings: async (): Promise<ChannelMessageSetting[]> => {
    const response = await api.get('/pms/channel-message-settings');
    return response.data.settings;
  },

  updateChannelMessageSetting: async (
    id: number,
    payload: Partial<ChannelMessageSetting>
  ): Promise<ChannelMessageSetting> => {
    const response = await api.put(`/pms/channel-message-settings/${id}`, payload);
    return response.data.setting;
  },

  paymentGatewaySettings: async (): Promise<PaymentGatewaySetting[]> => {
    const response = await api.get('/pms/payment-gateway-settings');
    return response.data.gateways;
  },

  updatePaymentGatewaySetting: async (
    id: number,
    payload: Partial<PaymentGatewaySetting>
  ): Promise<PaymentGatewaySetting> => {
    const response = await api.put(`/pms/payment-gateway-settings/${id}`, payload);
    return response.data.gateway;
  },

  guestPortalRequests: async (search?: string): Promise<GuestPortalRequest[]> => {
    const response = await api.get('/pms/guest-portal-requests', { params: search ? { search } : undefined });
    return response.data.requests;
  },

  folios: async (search?: string): Promise<Folio[]> => {
    const response = await api.get('/pms/folios', { params: search ? { search } : undefined });
    return response.data.folios;
  }
};

export default pmsService;
