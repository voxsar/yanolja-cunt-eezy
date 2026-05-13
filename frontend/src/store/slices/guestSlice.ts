import { createSlice } from '@reduxjs/toolkit';
import { Guest } from '../../types';

interface GuestState {
  guests: Guest[];
  loading: boolean;
  error: string | null;
}

const initialState: GuestState = {
  guests: [],
  loading: false,
  error: null,
};

const guestSlice = createSlice({
  name: 'guests',
  initialState,
  reducers: {},
});

export default guestSlice.reducer;
