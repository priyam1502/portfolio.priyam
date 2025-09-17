import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Person, Save, Edit } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: {
      address: user?.location?.address || '',
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      pincode: user?.location?.pincode || ''
    }
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        setEditing(false);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      location: {
        address: user?.location?.address || '',
        city: user?.location?.city || '',
        state: user?.location?.state || '',
        pincode: user?.location?.pincode || ''
      }
    });
    setEditing(false);
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {user?.phone}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="600">
                  Personal Information
                </Typography>
                {!editing && (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                    variant="outlined"
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                placeholder="your@email.com"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={user?.phone}
                disabled
                helperText="Phone number cannot be changed"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
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
                disabled={!editing}
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
                disabled={!editing}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                name="location.pincode"
                value={formData.location.pincode}
                onChange={handleChange}
                disabled={!editing}
                placeholder="6-digit pincode"
              />
            </Grid>

            {editing && (
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>

        {/* Account Info */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Account Type
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Member Since
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Verification Status
            </Typography>
            <Typography 
              variant="body1" 
              fontWeight="500"
              color={user?.isVerified ? 'success.main' : 'warning.main'}
            >
              {user?.isVerified ? 'Verified' : 'Pending Verification'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;