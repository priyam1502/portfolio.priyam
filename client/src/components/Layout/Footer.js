import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Agriculture, Phone, Email, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Agriculture />
              <Typography variant="h6" fontWeight="bold">
                FarmMarket
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Connecting farmers directly with consumers, eliminating middlemen 
              and ensuring fair prices for everyone.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/browse" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Browse Produce
              </Link>
              <Link href="/register" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Join as Farmer
              </Link>
              <Link href="/register" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Join as Buyer
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Contact Info
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +91 98765 43210
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Email fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  support@farmmarket.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mumbai, Maharashtra, India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 FarmMarket. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Made with ❤️ for SIH 2024
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;