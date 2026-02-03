import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shopsReducer from './slices/shopsSlice';
import mapReducer from './slices/mapSlice';
import uiReducer from './slices/uiSlice';
import reviewsReducer from './slices/reviewsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shops: shopsReducer,
    map: mapReducer,
    ui: uiReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['map/setMapInstance'],
        ignoredPaths: ['map.mapInstance'],
      },
    }),
});