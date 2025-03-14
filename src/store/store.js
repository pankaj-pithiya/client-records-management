import { configureStore } from '@reduxjs/toolkit';
import clientRecordsReducer from './slices/clientRecordsSlice';

const store = configureStore({
  reducer: {
    clientRecords: clientRecordsReducer,
  },
});

export default store; 