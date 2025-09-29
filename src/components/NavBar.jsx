import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Badge from '@mui/material/Badge';
import { useCart } from '../contexts/CartContext';

function NavBar({ user, logout }) {
  const { cartCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAdmin = user && (user.role === 'PLATFORM_ADMIN' || user.role === 'TENANT_ADMIN');
  const isPlatformAdmin = user && user.role === 'PLATFORM_ADMIN';
  const isTenantAdmin = user && user.role === 'TENANT_ADMIN';

  let dashboardPath = '';
  if (isPlatformAdmin) {
    dashboardPath = '/admin';
  } else if (isTenantAdmin) {
    dashboardPath = `/tenant/${user.tenantName}/dashboard`;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          E-Commerce
        </Typography>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
          }}
        >
          <IconButton color="inherit" component={Link} to="/">
            <HomeIcon />
          </IconButton>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" component={Link} to="/favorites">
            <FavoriteIcon />
          </IconButton>
          {isAdmin && dashboardPath && (
            <IconButton color="inherit" component={Link} to={dashboardPath}>
              <DashboardIcon />
            </IconButton>
          )}
          <IconButton color="inherit" component={Link} to="/profile">
            <PersonIcon />
          </IconButton>
          {user ? (
            <>
              <Typography sx={{ ml: 2, mr: 1 }}>Welcome, {user.firstName || 'User'}</Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>

        <IconButton
          color="inherit"
          sx={{ display: { xs: 'block', sm: 'none' } }}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} to="/">
            <HomeIcon sx={{ mr: 1 }} />
            Home
          </MenuItem>
          <MenuItem component={Link} to="/cart">
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon sx={{ mr: 1 }} />
            </Badge>
            Cart
          </MenuItem>
          <MenuItem component={Link} to="/favorites">
            <FavoriteIcon sx={{ mr: 1 }} />
            Favorites
          </MenuItem>
          {isAdmin && dashboardPath && (
            <MenuItem component={Link} to={dashboardPath}>
              <DashboardIcon sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
          )}
          <MenuItem component={Link} to="/profile">
            <PersonIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          {user ? [
            <MenuItem key="welcome" disabled>
              Welcome, {user.firstName || 'User'}
            </MenuItem>,
            <MenuItem key="logout" onClick={logout}>
              Logout
            </MenuItem>
          ] : [
            <MenuItem key="login" component={Link} to="/login">
              Login
            </MenuItem>,
            <MenuItem key="register" component={Link} to="/register">
              Register
            </MenuItem>
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;