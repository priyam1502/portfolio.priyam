import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  ShoppingCart,
  Store,
  Add,
  ListAlt,
  Logout,
  Agriculture,
  Person,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated, isFarmer, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = {
    farmer: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'My Listings', icon: <Store />, path: '/my-listings' },
      { text: 'Add Produce', icon: <Add />, path: '/add-produce' },
      { text: 'Orders', icon: <ListAlt />, path: '/farmer-orders' },
    ],
    buyer: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Browse Produce', icon: <Store />, path: '/browse' },
      { text: 'My Orders', icon: <ShoppingCart />, path: '/my-orders' },
    ]
  };

  const currentMenuItems = isAuthenticated ? menuItems[user?.userType] || [] : [];

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Agriculture color="primary" />
          <Typography variant="h6" color="primary" fontWeight="bold">
            FarmMarket
          </Typography>
        </Box>
        
        {isAuthenticated && (
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="500">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      <List>
        {isAuthenticated ? (
          <>
            {currentMenuItems.map((item) => (
              <ListItem
                key={item.path}
                button
                component={Link}
                to={item.path}
                onClick={toggleMobileMenu}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem
              button
              component={Link}
              to="/profile"
              onClick={toggleMobileMenu}
            >
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={toggleMobileMenu}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/register"
              onClick={toggleMobileMenu}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box display="flex" alignItems="center" gap={1}>
            <Agriculture />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                flexGrow: isMobile ? 1 : 0
              }}
            >
              FarmMarket
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && isAuthenticated && (
            <Box display="flex" gap={1} mr={2}>
              {currentMenuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <Box display="flex" alignItems="center" gap={1}>
              {!isMobile && (
                <IconButton color="inherit">
                  <Badge badgeContent={0} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              )}
              
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <Person fontSize="small" sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            !isMobile && (
              <Box display="flex" gap={1}>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )
          )}
        </Toolbar>
      </AppBar>
      
      <MobileDrawer />
    </>
  );
};

export default Header;