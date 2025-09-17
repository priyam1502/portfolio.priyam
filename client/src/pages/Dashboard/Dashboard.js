import React from 'react';
import { useAuth } from '../../context/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';

const Dashboard = () => {
  const { user, isFarmer, isBuyer } = useAuth();

  if (isFarmer) {
    return <FarmerDashboard />;
  }

  if (isBuyer) {
    return <BuyerDashboard />;
  }

  return null;
};

export default Dashboard;