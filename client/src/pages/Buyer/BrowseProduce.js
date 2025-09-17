import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn
} from '@mui/icons-material';
import { produceAPI } from '../../services/api';
import { toast } from 'react-toastify';

const BrowseProduce = () => {
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'others', label: 'Others' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'price.amount', label: 'Price: Low to High' },
    { value: 'price.amount', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    fetchProduce();
  }, [filters, pagination.current]);

  const fetchProduce = async (page = pagination.current) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: 12
      };

      // Clean up empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await produceAPI.getAll(params);
      setProduce(response.data.produce);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Fetch produce error:', error);
      toast.error('Failed to load produce');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSearch = () => {
    fetchProduce(1);
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Browse Fresh Produce 🌾
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover fresh produce directly from local farmers
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
          Search & Filter
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search produce"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="e.g., tomato, onion, rice"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="₹0"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Results */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Results Info */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="body1" color="text.secondary">
              {pagination.total} products found
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={`${filters.sortBy}_${filters.sortOrder}`}
                label="Sort by"
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('_');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
              >
                <MenuItem value="createdAt_desc">Latest First</MenuItem>
                <MenuItem value="price.amount_asc">Price: Low to High</MenuItem>
                <MenuItem value="price.amount_desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Produce Grid */}
          {produce.length > 0 ? (
            <Grid container spacing={3}>
              {produce.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: 200,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <Typography variant="h5" color="text.secondary">
                        {item.cropName}
                      </Typography>
                      <Chip
                        label={item.quality?.charAt(0).toUpperCase() + item.quality?.slice(1)}
                        color={item.quality === 'premium' ? 'success' : 'default'}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    </CardMedia>
                    
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {item.cropName}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {item.farmer?.name}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item.farmer?.location?.city}, {item.farmer?.location?.state}
                        </Typography>
                      </Box>
                      
                      {item.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {item.description.substring(0, 80)}
                          {item.description.length > 80 && '...'}
                        </Typography>
                      )}
                      
                      <Box mt="auto">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            ₹{item.price.amount}/{item.price.unit.replace('per_', '')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity.available} {item.quantity.unit} available
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          to={`/produce/${item._id}`}
                        >
                          View Details & Order
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info" sx={{ mt: 4 }}>
              No produce found matching your criteria. Try adjusting your filters.
            </Alert>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.pages}
                page={pagination.current}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default BrowseProduce;