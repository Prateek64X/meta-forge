"use client";
import React, { useEffect, useState } from 'react';
import { 
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useUser } from '../contexts/UserContext';

interface TokenData {
  name: string;
  symbol: string;
  balance: number;
  value: number | null;
}

interface GetBalanceProps {
  compact?: boolean;
}

const GetBalance = ({ compact = false }: GetBalanceProps) => {
  const { userData } = useUser();
  const { userId, address } = userData;
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        if (!address) {
          setLoading(false);
          return;
        }
        setLoading(true);
        const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
        
        const response = await fetch(
          `https://api.metal.build/holder/${address}/token/${tokenAddress}`,
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_METAL_API_KEY || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch token balance: ${response.status}`);
        }

        const data = await response.json();
        setTokenData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, [address]);

  const handleCopy = (text: string, type: 'id' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const toggleAddressVisibility = () => {
    setShowAddress(!showAddress);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowAddress(false);
  };

  const buttonStyles = {
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
  };

  if (compact) {
    return (
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        startIcon={
          <MonetizationOnIcon 
            sx={{ 
              color: '#ffd700',
              filter: 'drop-shadow(0 0 2px rgba(255,215,0,0.7))',
            }} 
          />
        }
        sx={{
          ...buttonStyles,
          px: 2,
          minWidth: 'auto'
        }}
      >
        {loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : tokenData ? (
          `${tokenData.balance.toLocaleString()} ${tokenData.symbol}`
        ) : (
          'N/A'
        )}
      </Button>
    );
  }

  if (loading) {
    return (
      <Button
        variant="contained"
        startIcon={
          <CircularProgress size={20} color="inherit" />
        }
        sx={buttonStyles}
      >
        Loading balance...
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        variant="contained"
        sx={buttonStyles}
      >
        Error: {error}
      </Button>
    );
  }

  if (!tokenData) {
    return (
      <Button
        variant="contained"
        sx={buttonStyles}
      >
        No token data
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        startIcon={
          <MonetizationOnIcon 
            sx={{ 
              color: '#ffd700',
              filter: 'drop-shadow(0 0 2px rgba(255,215,0,0.7))',
            }} 
          />
        }
        sx={buttonStyles}
      >
        {tokenData.balance.toLocaleString()} {tokenData.symbol}
      </Button>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(32,45,70,0.95) 0%, #202d46 100%)',
            border: '1px solid rgba(255,215,0,0.3)',
            color: '#ffd700'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255,215,0,0.2)' }} >
          Wallet Details
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="User ID"
              value={userId}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  color: '#ffd700',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,215,0,0.3)'
                  }
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copiedId ? 'Copied!' : 'Copy to clipboard'}>
                      <IconButton 
                        onClick={() => handleCopy(userId, 'id')}
                        sx={{ color: '#ffd700' }}
                      >
                        {copiedId ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,215,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ffd700'
                }
              }}
            />

            <TextField
              label="Wallet Address"
              value={showAddress ? address : '••••••••••••••••••••••••••••••••'}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  color: '#ffd700',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,215,0,0.3)'
                  }
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={toggleAddressVisibility}
                      sx={{ color: '#ffd700' }}
                    >
                      {showAddress ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    {showAddress && (
                      <Tooltip title={copiedAddress ? 'Copied!' : 'Copy to clipboard'}>
                        <IconButton 
                          onClick={() => handleCopy(address, 'address')}
                          sx={{ color: '#ffd700' }}
                        >
                          {copiedAddress ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                        </IconButton>
                      </Tooltip>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,215,0,0.7)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ffd700'
                }
              }}
            />

            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Token Information</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <MonetizationOnIcon fontSize="small" sx={{ color: '#ffd700', opacity: 0.8 }} />
                <Typography variant="body2">
                  {tokenData.name} ({tokenData.symbol}): {tokenData.balance.toLocaleString()}
                </Typography>
              </Box>
              {tokenData.value !== null && (
                <Typography variant="body2" sx={{ color: '#ffd700', fontWeight: 'bold', mt: 0.5 }}>
                  Value: ${tokenData.value.toFixed(2)}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,215,0,0.2)' }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{
              color: '#ffd700',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255,215,0,0.1)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GetBalance;