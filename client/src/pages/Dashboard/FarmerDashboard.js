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
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Inventory,
  Add,
  Visibility,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, produceAPI } from '../../services/api';
import { toast } from 'react-toastify';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [myProduce, setMyProduce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, produceResponse] = await Promise.all([
        orderAPI.getFarmerStats(),
        produceAPI.getMyListings({ limit: 5 })
      ]);

      setStats(statsResponse.data.stats);
      setRecentOrders(statsResponse.data.recentOrders);
      setMyProduce(produceResponse.data.produce);
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
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your farm business today.
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
                    {stats?.totalOrders || 0}
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
                    Pending Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {stats?.pendingOrders || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Inventory />
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
                    {stats?.completedOrders || 0}
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
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    ₹{(stats?.totalEarnings || 0).toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoney />
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
                  to="/farmer-orders"
                  variant="outlined"
                  size="small"
                >
                  View All
                </Button>
              </Box>

              {recentOrders.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Buyer</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {order.orderNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>{order.buyer?.name}</TableCell>
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
                  No orders yet. Your produce listings will start receiving orders soon!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & My Produce */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      component={Link}
                      to="/add-produce"
                      fullWidth
                    >
                      Add New Produce
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      component={Link}
                      to="/my-listings"
                      fullWidth
                    >
                      View My Listings
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ShoppingCart />}
                      component={Link}
                      to="/farmer-orders"
                      fullWidth
                    >
                      Manage Orders
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* My Active Produce */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="600">
                      Active Listings
                    </Typography>
                    <Button
                      component={Link}
                      to="/my-listings"
                      size="small"
                      variant="text"
                    >
                      View All
                    </Button>
                  </Box>

                  {myProduce.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {myProduce.slice(0, 3).map((produce) => (
                        <Box
                          key={produce._id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={2}
                          bgcolor="grey.50"
                          borderRadius={1}
                        >
                          <Box>
                            <Typography variant="subtitle2" fontWeight="500">
                              {produce.cropName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {produce.quantity.available} {produce.quantity.unit} available
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" color="primary.main" fontWeight="600">
                            ₹{produce.price.amount}/{produce.price.unit.replace('per_', '')}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      No active listings. Start by adding your first produce!
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FarmerDashboard;