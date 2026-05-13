import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomReducer from './slices/roomSlice';
import reservationReducer from './slices/reservationSlice';
import guestReducer from './slices/guestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
    reservations: reservationReducer,
    guests: guestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
