import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchShops } from '../store/slices/shopsSlice';
import SearchBar from '../components/SearchBar';
import MapComponent from '../components/MapComponent';
import ShopCard from '../components/ShopCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { shops, loading, error } = useAppSelector((state) => state.shops);
  const { userLocation } = useAppSelector((state) => state.map);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Shops</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => dispatch(fetchShops())}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Local Shops Near You</h1>
          <p className="text-xl mb-8">Discover businesses, check availability, and read reviews</p>
          <SearchBar />
        </div>
      </div>

      {/* View Toggle */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {shops.length} Shops Found
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="h-96 rounded-lg overflow-hidden shadow-lg">
            <MapComponent shops={shops} />
          </div>
        )}

        {shops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No shops found in your area.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;