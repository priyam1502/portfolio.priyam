import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Agriculture } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
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
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        toast.success('Registration successful! Welcome to FarmMarket!');
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <Agriculture color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Join FarmMarket
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account and start connecting with the farming community
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="10-digit phone number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>I am a</InputLabel>
                <Select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  label="I am a"
                >
                  <MenuItem value="farmer">Farmer (I want to sell produce)</MenuItem>
                  <MenuItem value="buyer">Buyer (I want to buy produce)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Location Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Street address, village, etc."
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
                required
                placeholder="6-digit pincode"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#4CAF50',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;