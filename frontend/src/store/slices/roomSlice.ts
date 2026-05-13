import { createSlice } from '@reduxjs/toolkit';
import { Room } from '../../types';

interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
});

export default roomSlice.reducer;
