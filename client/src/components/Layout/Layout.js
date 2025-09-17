import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;