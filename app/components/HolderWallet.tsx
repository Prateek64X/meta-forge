"use client";
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Typography 
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LoginIcon from '@mui/icons-material/Login';
import GetBalance from './GetBalance';
import { useUser } from '../contexts/UserContext';

interface HolderResponse {
  success: boolean;
  id: string;
  address: string;
  totalValue: number;
  tokens: any[];
}

const HolderWallet = () => {
  const { userData, setUserData } = useUser();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [userIdInput, setUserIdInput] = useState('');

  // Debug effect to log userData changes
  useEffect(() => {
    console.log('Current userData:', userData);
  }, [userData]);

  const handleHolderRequest = async (userId: string) => {
    try {
      console.log('[DEBUG] Making holder request with userId:', userId);
      const response = await fetch(`https://api.metal.build/holder/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_METAL_API_KEY || '',
        },
      });

      const data: HolderResponse = await response.json();
      console.log('[DEBUG] API Response:', {
        status: response.status,
        id: data.id,
        address: data.address
      });

      if (!response.ok) {
        throw new Error(data.message || 'Failed to access holder');
      }

      if (!data.id || !data.address) {
        console.warn('[WARNING] API response missing id or address:', data);
        throw new Error('Invalid holder data received');
      }

      return data;
    } catch (err) {
      console.error('[ERROR] in handleHolderRequest:', err);
      throw err instanceof Error ? err : new Error('Failed to access holder');
    }
  };

  const handleRegister = async () => {
    console.log('[DEBUG] Starting registration flow');
    setLoading(true);
    setError('');

    try {
      const newUserId = Math.random().toString(36).substring(2, 15);
      console.log('[DEBUG] Generated new userId:', newUserId);
      
      const data = await handleHolderRequest(newUserId);
      console.log('[DEBUG] Registration successful, data:', data);

      const newUserData = {
        userId: data.id,
        address: data.address,
        developerMode: userData.developerMode
      };
      console.log('[DEBUG] Setting new user data:', newUserData);

      setUserData(newUserData);
      localStorage.setItem('userData', JSON.stringify(newUserData));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create holder';
      console.error('[ERROR] Registration failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setOpenLoginDialog(false);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setError('');

    try {
      if (!userIdInput.trim()) {
        throw new Error('Please enter a valid User ID');
      }

      const data = await handleHolderRequest(userIdInput);
      console.log('[DEBUG] Received data in login:', data);
      console.log('[DEBUG] ID:', data.id, '| Address:', data.address);

      const newUserData = {
        userId: data.id,
        address: data.address,
        developerMode: userData.developerMode
      };
      console.log('[DEBUG] Setting user data from login:', newUserData);

      setUserData(newUserData);
      localStorage.setItem('userData', JSON.stringify(newUserData));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('[ERROR] Login failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoginLoading(false);
      setOpenLoginDialog(false);
    }
  };

  const handleOpenLoginDialog = () => {
    console.log('[DEBUG] Opening login dialog');
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    console.log('[DEBUG] Closing login dialog');
    setOpenLoginDialog(false);
    setError('');
  };

  if (userData.userId && userData.address) {
    console.log('[DEBUG] Rendering connected wallet state', {
      userId: userData.userId,
      address: userData.address
    });
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '120px',
        }}
      >
        <GetBalance compact />
      </Box>
    );
  }

  console.log('[DEBUG] Rendering connect wallet button');
  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenLoginDialog}
        startIcon={<AccountBalanceWalletIcon />}
        sx={{
          background: 'linear-gradient(135deg, rgba(32,45,70,0.9) 0%, #202d46 100%)',
          color: '#ffd700',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: '20px',
          px: 3,
          py: 1,
          fontWeight: 'bold',
          boxShadow: '0 0 10px rgba(255,215,0,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(32,45,70,1) 0%, #1a2438 100%)',
            boxShadow: '0 0 15px rgba(255,215,0,0.5)',
          },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.1), transparent)',
            transform: 'rotate(45deg)',
            animation: 'shine 3s infinite',
          },
          '@keyframes shine': {
            '0%': { transform: 'translateX(-100%) rotate(45deg)' },
            '100%': { transform: 'translateX(100%) rotate(45deg)' },
          },
        }}
      >
        Connect
      </Button>

      <Dialog open={openLoginDialog} onClose={handleCloseLoginDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalanceWalletIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">Connect Wallet</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="User ID"
              value={userIdInput}
              onChange={(e) => {
                console.log('[DEBUG] User ID input changed:', e.target.value);
                setUserIdInput(e.target.value);
              }}
              fullWidth
              required
              helperText="Enter your existing holder ID"
              sx={{ mt: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={!userIdInput || loginLoading}
              startIcon={
                loginLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 'bold',
              }}
            >
              {loginLoading ? 'Connecting...' : 'Login with Existing ID'}
            </Button>

            <Typography variant="body2" align="center" sx={{ my: 1 }}>
              ─── OR ───
            </Typography>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleRegister}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AccountBalanceWalletIcon />
                )
              }
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 'bold',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                }
              }}
            >
              {loading ? 'Creating...' : 'Create New Wallet'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseLoginDialog}
            sx={{ fontWeight: 'bold' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HolderWallet;