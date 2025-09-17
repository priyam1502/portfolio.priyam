import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import BrowseProduce from './pages/Buyer/BrowseProduce';
import ProduceDetails from './pages/Buyer/ProduceDetails';
import MyOrders from './pages/Buyer/MyOrders';
import MyListings from './pages/Farmer/MyListings';
import AddProduce from './pages/Farmer/AddProduce';
import EditProduce from './pages/Farmer/EditProduce';
import FarmerOrders from './pages/Farmer/FarmerOrders';
import OrderDetails from './pages/Orders/OrderDetails';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound';

function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route 
            path="login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login />
            } 
          />
          <Route 
            path="register" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Register />
            } 
          />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Buyer Routes */}
          <Route path="browse" element={
            <ProtectedRoute userType="buyer">
              <BrowseProduce />
            </ProtectedRoute>
          } />
          
          <Route path="produce/:id" element={
            <ProtectedRoute userType="buyer">
              <ProduceDetails />
            </ProtectedRoute>
          } />
          
          <Route path="my-orders" element={
            <ProtectedRoute userType="buyer">
              <MyOrders />
            </ProtectedRoute>
          } />
          
          {/* Farmer Routes */}
          <Route path="my-listings" element={
            <ProtectedRoute userType="farmer">
              <MyListings />
            </ProtectedRoute>
          } />
          
          <Route path="add-produce" element={
            <ProtectedRoute userType="farmer">
              <AddProduce />
            </ProtectedRoute>
          } />
          
          <Route path="edit-produce/:id" element={
            <ProtectedRoute userType="farmer">
              <EditProduce />
            </ProtectedRoute>
          } />
          
          <Route path="farmer-orders" element={
            <ProtectedRoute userType="farmer">
              <FarmerOrders />
            </ProtectedRoute>
          } />
          
          {/* Common Routes */}
          <Route path="orders/:id" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;