import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
        py={4}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '6rem',
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Home />}
            component={Link}
            to="/"
            size="large"
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => window.history.back()}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;