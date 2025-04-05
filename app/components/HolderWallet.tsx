"use client";
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LoginIcon from '@mui/icons-material/Login';
import { generateUserId } from './utils/idGenerator';
import GetBalance from './GetBalance';

interface HolderResponse {
  success: boolean;
  id: string;
  address: string;
  totalValue: number;
  tokens: any[];
}

interface HolderWalletProps {
  onHolderCreated: (address: string, userId: string) => void;
}

const HolderWallet = ({ onHolderCreated }: HolderWalletProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [holderData, setHolderData] = useState<HolderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [copiedItem, setCopiedItem] = useState<'address' | 'userId' | null>(null);
  const [userIdInput, setUserIdInput] = useState('');
  const [holderValid, setHolderValid] = useState(false);
  const [holderAddress, setHolderAddress] = useState('');

  const handleHolderRequest = async (userId: string) => {
    try {
      const response = await fetch(`https://api.metal.build/holder/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_METAL_API_KEY || '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to access holder');
      }

      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to access holder');
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const userId = generateUserId();
      const data = await handleHolderRequest(userId);

      setHolderData(data);
      setOpenDialog(true);
      onHolderCreated(data.address, data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create holder');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    setError('');

    try {
      const data = await handleHolderRequest(userIdInput);

      // If we get here, holder is valid
      setHolderValid(true);
      setHolderAddress(data.address);
      setHolderData(data);
      onHolderCreated(data.address, data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCopy = (text: string, item: 'address' | 'userId') => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setCopySuccess(true);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handleOpenLoginDialog = () => {
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
    setError('');
  };

  if (holderValid && holderAddress && holderData) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '120px',
        }}
      >
        <GetBalance holderAddress={holderAddress} compact />
      </Box>
    );
  }

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

      {/* Login Dialog */}
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
              onChange={(e) => setUserIdInput(e.target.value)}
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

      {/* Registration Success Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalanceWalletIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">Wallet Created Successfully!</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your new wallet has been created. Please save these details:
          </DialogContentText>
          
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">Wallet Address</Typography>
            <Box
              p={2}
              bgcolor="action.hover"
              borderRadius="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Typography variant="body1" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                {holderData?.address}
              </Typography>
              <IconButton 
                onClick={() => holderData?.address && handleCopy(holderData.address, 'address')}
                color="primary"
                aria-label="Copy address"
                size="small"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold">User ID</Typography>
            <Box
              p={2}
              bgcolor="action.hover"
              borderRadius="12px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Typography variant="body1" fontFamily="monospace">
                {holderData?.id}
              </Typography>
              <IconButton 
                onClick={() => holderData?.id && handleCopy(holderData.id, 'userId')}
                color="primary"
                aria-label="Copy user ID"
                size="small"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog} 
            color="primary"
            variant="contained"
            sx={{ fontWeight: 'bold', borderRadius: '12px', px: 3 }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {copiedItem === 'address' ? 'Wallet Address' : 'User ID'} copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default HolderWallet;