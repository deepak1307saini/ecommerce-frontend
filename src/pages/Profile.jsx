import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemIcon, Paper, Divider, Avatar, ListItemButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Profile() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Profile
          </Typography>
          {user && (
            <>
              <Typography variant="subtitle1" color="text.secondary">
                Name: {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Email: {user?.email}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Role: {user.role}
              </Typography>
              {user.tenantName && (
                <Typography variant="subtitle1" color="text.secondary">
                  Tenant: {user.tenantName}
                </Typography>
              )}
            </>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/orders/history">
              <ListItemIcon>
                <HistoryIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Order History" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/favorites">
              <ListItemIcon>
                <FavoriteIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Button
          onClick={logout}
          variant="contained"
          color="error"
          startIcon={<ExitToAppIcon />}
          fullWidth
          sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}

export default Profile;