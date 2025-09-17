import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Agriculture,
  TrendingUp,
  Handshake,
  Security,
  Speed,
  EcoFriendly
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isFarmer, isBuyer } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Handshake />,
      title: 'Direct Connection',
      description: 'Connect farmers directly with buyers, eliminating middlemen'
    },
    {
      icon: <TrendingUp />,
      title: 'Fair Pricing',
      description: 'Farmers get better prices, buyers pay fair market rates'
    },
    {
      icon: <Speed />,
      title: 'Quick Orders',
      description: 'Fast and efficient ordering system with real-time updates'
    },
    {
      icon: <Security />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing for all transactions'
    },
    {
      icon: <EcoFriendly />,
      title: 'Fresh Produce',
      description: 'Get the freshest produce directly from the farm'
    },
    {
      icon: <Agriculture />,
      title: 'Support Farmers',
      description: 'Help local farmers grow their business and livelihood'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Farmers' },
    { number: '2000+', label: 'Happy Buyers' },
    { number: '10K+', label: 'Orders Completed' },
    { number: '₹50L+', label: 'Farmer Earnings' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? "h3" : "h2"}
            fontWeight="bold"
            gutterBottom
          >
            Farm to Table, Direct & Simple
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
          >
            Connect directly with local farmers. Get fresh produce at fair prices 
            while supporting your local farming community.
          </Typography>
          
          {!isAuthenticated ? (
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/browse"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Browse Produce
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/dashboard"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Go to Dashboard
            </Button>
          )}
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Why Choose FarmMarket?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of farmers and buyers who trust FarmMarket
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                For Farmers
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                List your produce, connect with buyers, and get fair prices for your harvest.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                component={Link}
                to="/register"
                size="large"
              >
                Join as Farmer
              </Button>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                For Buyers
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Browse fresh produce, order directly from farmers, and support local agriculture.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/register"
                size="large"
              >
                Join as Buyer
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;