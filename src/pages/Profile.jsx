import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

function Profile() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      {user && (
        <>
          <Typography>Role: {user.role}</Typography>
          {user.tenantName && <Typography>Tenant: {user.tenantName}</Typography>}
        </>
      )}
      <List>
        <ListItem>
          <ListItemText>
            <Link to="/orders/history">Order History</Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <Link to="/favorites">Favorites</Link>
          </ListItemText>
        </ListItem>
      </List>
      <Button onClick={logout} variant="contained" color="error" sx={{ mt: 2 }}>
        Logout
      </Button>
    </Box>
  );
}

export default Profile;