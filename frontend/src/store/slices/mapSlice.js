import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    mapInstance: null,
    userLocation: {
      lat: 27.7172,
      lng: 85.3240,
      address: 'Kathmandu, Nepal'
    },
    center: {
      lat: 27.7172,
      lng: 85.3240
    },
    zoom: 12,
    searchRadius: 5,
    showRadius: true,
    markers: [],
    selectedShop: null,
    radiusCircle: null
  },
  reducers: {
    setMapInstance: (state, action) => {
      state.mapInstance = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
      // Update center to user location
      state.center = {
        lat: action.payload.lat,
        lng: action.payload.lng
      };
    },
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setSearchRadius: (state, action) => {
      state.searchRadius = action.payload;
    },
    setShowRadius: (state, action) => {
      state.showRadius = action.payload;
    },
    setMarkers: (state, action) => {
      state.markers = action.payload;
    },
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
    setRadiusCircle: (state, action) => {
      state.radiusCircle = action.payload;
    },
    clearMapData: (state) => {
      state.markers = [];
      state.selectedShop = null;
      state.radiusCircle = null;
    }
  }
});

export const {
  setMapInstance,
  setUserLocation,
  setCenter,
  setZoom,
  setSearchRadius,
  setShowRadius,
  setMarkers,
  setSelectedShop,
  setRadiusCircle,
  clearMapData
} = mapSlice.actions;

export default mapSlice.reducer;