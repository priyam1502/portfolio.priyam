import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { produceAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AddProduce = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cropName: '',
    category: '',
    quantity: {
      available: '',
      unit: ''
    },
    price: {
      amount: '',
      unit: ''
    },
    description: '',
    quality: 'standard',
    harvestDate: '',
    location: {
      address: user?.location?.address || '',
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      pincode: user?.location?.pincode || ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'pulses', label: 'Pulses' },
    { value: 'spices', label: 'Spices' },
    { value: 'others', label: 'Others' }
  ];

  const quantityUnits = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'quintal', label: 'Quintals' },
    { value: 'ton', label: 'Tons' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'dozen', label: 'Dozen' }
  ];

  const priceUnits = [
    { value: 'per_kg', label: 'Per Kg' },
    { value: 'per_quintal', label: 'Per Quintal' },
    { value: 'per_ton', label: 'Per Ton' },
    { value: 'per_piece', label: 'Per Piece' },
    { value: 'per_dozen', label: 'Per Dozen' }
  ];

  const qualityOptions = [
    { value: 'premium', label: 'Premium' },
    { value: 'standard', label: 'Standard' },
    { value: 'economy', label: 'Economy' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const validateForm = () => {
    if (!formData.cropName.trim()) {
      setError('Crop name is required');
      return false;
    }
    
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    
    if (!formData.quantity.available || formData.quantity.available <= 0) {
      setError('Valid quantity is required');
      return false;
    }
    
    if (!formData.quantity.unit) {
      setError('Quantity unit is required');
      return false;
    }
    
    if (!formData.price.amount || formData.price.amount <= 0) {
      setError('Valid price is required');
      return false;
    }
    
    if (!formData.price.unit) {
      setError('Price unit is required');
      return false;
    }
    
    if (!formData.location.city || !formData.location.state) {
      setError('City and state are required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        quantity: {
          ...formData.quantity,
          available: parseFloat(formData.quantity.available)
        },
        price: {
          ...formData.price,
          amount: parseFloat(formData.price.amount)
        }
      };

      await produceAPI.create(submitData);
      toast.success('Produce listing created successfully!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Create produce error:', error);
      setError(error.response?.data?.message || 'Failed to create produce listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Add New Produce
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Crop Name"
                name="cropName"
                value={formData.cropName}
                onChange={handleChange}
                required
                placeholder="e.g., Fresh Tomatoes, Red Onions"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Describe your produce, farming methods, quality, etc."
              />
            </Grid>

            {/* Quantity & Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mt: 2 }}>
                Quantity & Pricing
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Available Quantity"
                name="quantity.available"
                type="number"
                value={formData.quantity.available}
                onChange={handleChange}
                required
                inputProps={{ min: 0.1, step: 0.1 }}
                placeholder="e.g., 50"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Quantity Unit</InputLabel>
                <Select
                  name="quantity.unit"
                  value={formData.quantity.unit}
                  onChange={handleChange}
                  label="Quantity Unit"
                >
                  {quantityUnits.map(unit => (
                    <MenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price.amount"
                type="number"
                value={formData.price.amount}
                onChange={handleChange}
                required
                inputProps={{ min: 0.1, step: 0.1 }}
                placeholder="e.g., 20"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Price Unit</InputLabel>
                <Select
                  name="price.unit"
                  value={formData.price.unit}
                  onChange={handleChange}
                  label="Price Unit"
                >
                  {priceUnits.map(unit => (
                    <MenuItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mt: 2 }}>
                Additional Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Quality</InputLabel>
                <Select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  label="Quality"
                >
                  {qualityOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Harvest Date"
                name="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mt: 2 }}>
                Location
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Farm address, village, etc."
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                required
                placeholder="Your city"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
                placeholder="Your state"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                name="location.pincode"
                value={formData.location.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Add />}
                  disabled={loading}
                  size="large"
                >
                  {loading ? <CircularProgress size={20} /> : 'Create Listing'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduce;