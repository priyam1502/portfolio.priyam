import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userType && user?.userType !== userType) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        textAlign="center"
        p={4}
      >
        <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This page is only accessible to {userType}s.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;