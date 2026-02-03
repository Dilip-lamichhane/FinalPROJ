import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunks
export const fetchShops = createAsyncThunk(
  'shops/fetchShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shops');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch shops');
    }
  }
);

export const searchShops = createAsyncThunk(
  'shops/searchShops',
  async ({ lat, lng, radius, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/shops/search', {
        params: { lat, lng, radius, page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search shops');
    }
  }
);

export const getShopDetails = createAsyncThunk(
  'shops/getShopDetails',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shops/${shopId}`);
      return response.data.shop;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch shop details');
    }
  }
);

export const createShop = createAsyncThunk(
  'shops/createShop',
  async (shopData, { rejectWithValue }) => {
    try {
      const response = await api.post('/shops', shopData);
      return response.data.shop;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create shop');
    }
  }
);

export const updateShop = createAsyncThunk(
  'shops/updateShop',
  async ({ shopId, shopData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/shops/${shopId}`, shopData);
      return response.data.shop;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update shop');
    }
  }
);

export const deleteShop = createAsyncThunk(
  'shops/deleteShop',
  async (shopId, { rejectWithValue }) => {
    try {
      await api.delete(`/shops/${shopId}`);
      return shopId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete shop');
    }
  }
);

const shopsSlice = createSlice({
  name: 'shops',
  initialState: {
    shops: [],
    currentShop: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 1
    },
    searchParams: {
      lat: null,
      lng: null,
      radius: 5
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentShop: (state, action) => {
      state.currentShop = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearShops: (state) => {
      state.shops = [];
      state.currentShop = null;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch shops
      .addCase(fetchShops.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload.shops || action.payload;
        state.error = null;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search shops
      .addCase(searchShops.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = action.payload.shops;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(searchShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get shop details
      .addCase(getShopDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getShopDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentShop = action.payload;
        state.error = null;
      })
      .addCase(getShopDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create shop
      .addCase(createShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops.unshift(action.payload);
        state.error = null;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update shop
      .addCase(updateShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.shops.findIndex(shop => shop._id === action.payload._id);
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
        if (state.currentShop && state.currentShop._id === action.payload._id) {
          state.currentShop = action.payload;
        }
        state.error = null;
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete shop
      .addCase(deleteShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shops = state.shops.filter(shop => shop._id !== action.payload);
        if (state.currentShop && state.currentShop._id === action.payload) {
          state.currentShop = null;
        }
        state.error = null;
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentShop, setSearchParams, clearShops } = shopsSlice.actions;
export default shopsSlice.reducer;