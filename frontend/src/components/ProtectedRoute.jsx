import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { user: backendUser, isLoading } = useAppSelector((state) => state.auth);

  // Show loading while Clerk is initializing or backend sync is in progress
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not authenticated with Clerk
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Backend user not loaded yet (sync in progress)
  if (!backendUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check role requirement
  if (requiredRole && backendUser?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;