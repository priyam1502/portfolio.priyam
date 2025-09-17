import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  CardMedia
} from '@mui/material';
import {
  ShoppingCart,
  Store,
  TrendingUp,
  LocalShipping
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, produceAPI } from '../../services/api';
import { toast } from 'react-toastify';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [featuredProduce, setFeaturedProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse, produceResponse] = await Promise.all([
        orderAPI.getBuyerOrders({ limit: 5 }),
        produceAPI.getAll({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      const ordersData = ordersResponse.data.orders;
      setOrders(ordersData);
      setFeaturedProduce(produceResponse.data.produce);

      // Calculate order statistics
      const stats = ordersData.reduce((acc, order) => {
        acc.total += 1;
        acc.totalSpent += order.orderDetails?.totalAmount || 0;
        
        if (order.status === 'pending' || order.status === 'accepted') {
          acc.pending += 1;
        }
        if (order.status === 'delivered') {
          acc.delivered += 1;
        }
        
        return acc;
      }, { total: 0, pending: 0, delivered: 0, totalSpent: 0 });

      setOrderStats(stats);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      accepted: 'info',
      dispatched: 'primary',
      delivered: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome, {user?.name}! 🛒
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover fresh produce from local farmers and track your orders.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {orderStats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ShoppingCart />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {orderStats.pending}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <LocalShipping />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {orderStats.delivered}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Spent
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    ₹{orderStats.totalSpent.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Store />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="600">
                  Recent Orders
                </Typography>
                <Button
                  component={Link}
                  to="/my-orders"
                  variant="outlined"
                  size="small"
                >
                  View All
                </Button>
              </Box>

              {orders.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Farmer</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {order.orderNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>{order.farmer?.name}</TableCell>
                          <TableCell>{order.orderDetails?.cropName}</TableCell>
                          <TableCell>
                            ₹{order.orderDetails?.totalAmount?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  No orders yet. Start browsing fresh produce from local farmers!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Store />}
                  component={Link}
                  to="/browse"
                  fullWidth
                >
                  Browse Produce
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingCart />}
                  component={Link}
                  to="/my-orders"
                  fullWidth
                >
                  My Orders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Featured Produce */}
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="600">
            Fresh Produce Available
          </Typography>
          <Button
            component={Link}
            to="/browse"
            variant="outlined"
          >
            Browse All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProduce.map((produce) => (
            <Grid item xs={12} sm={6} md={4} key={produce._id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardMedia
                  sx={{
                    height: 140,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {produce.cropName}
                  </Typography>
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {produce.cropName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    By {produce.farmer?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📍 {produce.farmer?.location?.city}, {produce.farmer?.location?.state}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      ₹{produce.price.amount}/{produce.price.unit.replace('per_', '')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {produce.quantity.available} {produce.quantity.unit}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/produce/${produce._id}`}
                    sx={{ mt: 2 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default BuyerDashboard;