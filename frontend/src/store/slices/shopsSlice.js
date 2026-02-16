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

const mapSupabaseShopRow = (row) => ({
  _id: `sb_${row.id}`,
  name: row.name,
  description: null,
  image: null,
  address: row.address,
  phone: null,
  rating: 0,
  reviewCount: 0,
  category: row.category ? { name: row.category } : null,
  operatingHours: null,
  distance: undefined,
  location: {
    type: 'Point',
    coordinates: [Number(row.longitude), Number(row.latitude)],
  },
});

// Async thunks
export const fetchShops = createAsyncThunk(
  'shops/fetchShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shops/search');
      const { shops = [], totalPages = 1, currentPage = 1, total = shops.length } = response.data || {};
      return {
        shops,
        pagination: {
          page: currentPage,
          limit: shops.length,
          total,
          pages: totalPages,
        },
      };
    } catch (error) {
      try {
        const response = await api.get('/supabase/shops');
        const shops = (response.data?.shops || []).map(mapSupabaseShopRow);
        return {
          shops,
          pagination: {
            page: 1,
            limit: shops.length,
            total: shops.length,
            pages: 1,
          },
        };
      } catch (fallbackError) {
        return rejectWithValue(
          error.response?.data?.error ||
            fallbackError.response?.data?.error ||
            'Failed to fetch shops'
        );
      }
    }
  }
);

export const fetchSupabaseShops = createAsyncThunk(
  'shops/fetchSupabaseShops',
  async (params = {}, { rejectWithValue }) => {
    try {
      const normalizedParams = params && typeof params === 'object' ? params : {};
      const product = String(normalizedParams.product || '').trim();
      const category = String(normalizedParams.category || '').trim();

      const pageSize = 500;
      const maxPages = 20;
      let offset = 0;
      let rows = [];

      for (let page = 0; page < maxPages; page += 1) {
        const response = await api.get('/supabase/shops', {
          params: {
            limit: pageSize,
            offset,
            ...(product ? { product } : {}),
            ...(category ? { category } : {}),
          },
        });

        const batch = response.data?.shops || [];
        rows = rows.concat(batch);

        if (batch.length < pageSize) break;
        offset += pageSize;
      }

      const shops = rows
        .map(mapSupabaseShopRow)
        .filter(
          (shop) =>
            Number.isFinite(shop.location?.coordinates?.[0]) &&
            Number.isFinite(shop.location?.coordinates?.[1])
        );

      return {
        shops,
        pagination: {
          page: 1,
          limit: shops.length,
          total: shops.length,
          pages: 1,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch Supabase shops');
    }
  }
);

export const fetchSupabaseShopProducts = createAsyncThunk(
  'shops/fetchSupabaseShopProducts',
  async ({ shopId, q } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/supabase/shops/${shopId}/products`, {
        params: q ? { q } : undefined,
      });
      return {
        shopId: String(shopId),
        products: response.data?.products || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch shop catalog');
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
      const { shops = [], totalPages = 1, currentPage = page, total = shops.length } = response.data || {};
      return {
        shops,
        pagination: {
          page: currentPage,
          limit,
          total,
          pages: totalPages,
        },
      };
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
    loading: false,
    error: null,
    supabaseCatalog: {
      byShopId: {},
      loadingByShopId: {},
      errorByShopId: {},
    },
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload.shops;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupabaseShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupabaseShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload.shops;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSupabaseShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSupabaseShopProducts.pending, (state, action) => {
        const shopId = String(action.meta.arg?.shopId ?? '');
        if (shopId) {
          state.supabaseCatalog.loadingByShopId[shopId] = true;
          state.supabaseCatalog.errorByShopId[shopId] = null;
        }
      })
      .addCase(fetchSupabaseShopProducts.fulfilled, (state, action) => {
        const shopId = String(action.payload?.shopId ?? '');
        if (shopId) {
          state.supabaseCatalog.loadingByShopId[shopId] = false;
          state.supabaseCatalog.byShopId[shopId] = action.payload.products || [];
          state.supabaseCatalog.errorByShopId[shopId] = null;
        }
      })
      .addCase(fetchSupabaseShopProducts.rejected, (state, action) => {
        const shopId = String(action.meta.arg?.shopId ?? '');
        if (shopId) {
          state.supabaseCatalog.loadingByShopId[shopId] = false;
          state.supabaseCatalog.errorByShopId[shopId] = action.payload || 'Failed to fetch shop catalog';
        }
      })
      // Search shops
      .addCase(searchShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload.shops;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(searchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get shop details
      .addCase(getShopDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShopDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShop = action.payload;
        state.error = null;
      })
      .addCase(getShopDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create shop
      .addCase(createShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shops.unshift(action.payload);
        state.error = null;
      })
      .addCase(createShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update shop
      .addCase(updateShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.payload;
      })
      // Delete shop
      .addCase(deleteShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = state.shops.filter(shop => shop._id !== action.payload);
        if (state.currentShop && state.currentShop._id === action.payload) {
          state.currentShop = null;
        }
        state.error = null;
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentShop, setSearchParams, clearShops } = shopsSlice.actions;
export default shopsSlice.reducer;
