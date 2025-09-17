import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Agriculture } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.phone, formData.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (userType) => {
    setLoading(true);
    const demoCredentials = {
      farmer: { phone: '9876543210', password: 'demo123' },
      buyer: { phone: '9876543211', password: 'demo123' }
    };

    try {
      const result = await login(
        demoCredentials[userType].phone,
        demoCredentials[userType].password
      );
      
      if (result.success) {
        toast.success(`Demo ${userType} login successful!`);
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <Agriculture color="primary" sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your FarmMarket account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            placeholder="Enter your phone number"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 3, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Demo Accounts
          </Typography>
        </Divider>

        <Box display="flex" gap={2} mb={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => demoLogin('farmer')}
            disabled={loading}
          >
            Demo Farmer
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => demoLogin('buyer')}
            disabled={loading}
          >
            Demo Buyer
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#4CAF50',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;