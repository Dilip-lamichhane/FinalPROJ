import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    error: null,
    success: null,
    sidebarOpen: false,
    modal: {
      isOpen: false,
      type: null,
      data: null
    },
    filters: {
      category: '',
      distance: 5,
      rating: 0,
      openNow: false
    },
    searchQuery: '',
    sortBy: 'distance',
    viewMode: 'map' // 'map' or 'list'
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.success = null;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.error = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setModal: (state, action) => {
      state.modal = { ...state.modal, ...action.payload };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null
      };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: '',
        distance: 5,
        rating: 0,
        openNow: false
      };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  setSuccess,
  clearMessages,
  setSidebarOpen,
  setModal,
  closeModal,
  setFilters,
  resetFilters,
  setSearchQuery,
  setSortBy,
  setViewMode
} = uiSlice.actions;

export default uiSlice.reducer;