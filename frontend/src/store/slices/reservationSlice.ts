import { createSlice } from '@reduxjs/toolkit';
import { Reservation } from '../../types';

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
});

export default reservationSlice.reducer;
