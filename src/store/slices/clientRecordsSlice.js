import { createSlice } from '@reduxjs/toolkit';
import { CLIENT_RECORDS_STORAGE_KEY } from '../../constants/constant';

const clientRecordsSlice = createSlice({
  name: 'clientRecords',
  initialState: {
    records: [],
  },
  reducers: {
    setRecords(state, action) {
      state.records = action.payload;
      localStorage.setItem(CLIENT_RECORDS_STORAGE_KEY, JSON.stringify(action.payload));
    },
    updateRecord(state, action) {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
      localStorage.setItem(CLIENT_RECORDS_STORAGE_KEY, JSON.stringify(state.records));
    },
    deleteRecord(state, action) {
      state.records = state.records.filter(record => record.id !== action.payload);
      localStorage.setItem(CLIENT_RECORDS_STORAGE_KEY, JSON.stringify(state.records));
    },
  },
});

export const { setRecords, updateRecord, deleteRecord } = clientRecordsSlice.actions;
export default clientRecordsSlice.reducer; 