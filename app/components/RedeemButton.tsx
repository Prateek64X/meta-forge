/**
 * This component distributes tokens to your users on Base. 
 * It uses the Metal API endpoint to distribute tokens from your app balance 
 * to specified holder's addresses.
 */

import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Alert,
  Box,
  styled,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  fontWeight: 'bold',
}));

interface RedeemButtonProps {
  amount: number;
  sendTo: string;
  disabled?: boolean;
}

const RedeemButton = ({ 
  amount, 
  sendTo,
  disabled = false 
}: RedeemButtonProps) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Get token address from environment variable
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;

  if (!tokenAddress) {
    throw new Error('Token address is not set in the environment variables.');
  }

  const handleRedeem = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      alert("RedeemButton - tokenAddress = "+tokenAddress || '');  // Debugging line to check tokenAddress

      const response = await fetch(
        `https://api.metal.build/token/${tokenAddress}/distribute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_METAL_API_KEY || '',
          },
          body: JSON.stringify({
            sendToAddress: sendTo,
            amount: amount
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token distribution failed');
      }

      setSuccess(true);
      setOpenSnackbar(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Token distribution failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Calculate disabled state
  const isButtonDisabled = disabled || loading || !sendTo || amount <= 0;

  return (
    <Box>
      <Box 
        sx={{ 
          color: 'grey.600',
          fontSize: '1.25rem',
          textAlign: 'center',
          mb: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        {amount} Tokens
      </Box>

      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleRedeem}
        disabled={isButtonDisabled}
        sx={{
          fontSize: '1rem'
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Redeem'
        )}
      </StyledButton>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Successfully redeemed {amount} tokens!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RedeemButton;
