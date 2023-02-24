import { configureStore } from '@reduxjs/toolkit';

import { uiSlice, calendarSlice } from './index';


export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        calendar: calendarSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});