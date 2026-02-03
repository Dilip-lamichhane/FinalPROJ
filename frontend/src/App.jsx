import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getProfile } from './store/slices/authSlice';
import { searchShops } from './store/slices/shopsSlice';
import { setUserLocation } from './store/slices/mapSlice';
import { setLoading } from './store/slices/uiSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopDetailsPage from './pages/ShopDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { userLocation, searchRadius } = useAppSelector((state) => state.map);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    // Get user location on app load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Get address from coordinates
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              dispatch(setUserLocation({
                lat: latitude,
                lng: longitude,
                address: data.display_name || 'Current Location'
              }));
            })
            .catch(() => {
              dispatch(setUserLocation({
                lat: latitude,
                lng: longitude,
                address: 'Current Location'
              }));
            });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to Kathmandu
          dispatch(setUserLocation({
            lat: 27.7172,
            lng: 85.3240,
            address: 'Kathmandu, Nepal'
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      // Default to Kathmandu if geolocation not supported
      dispatch(setUserLocation({
        lat: 27.7172,
        lng: 85.3240,
        address: 'Kathmandu, Nepal'
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    // Search shops when location is available
    if (userLocation.lat && userLocation.lng) {
      dispatch(setLoading(true));
      dispatch(searchShops({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: searchRadius,
        page: 1,
        limit: 10
      })).finally(() => {
        dispatch(setLoading(false));
      });
    }
  }, [dispatch, userLocation, searchRadius]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shops/:id" element={<ShopDetailsPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
