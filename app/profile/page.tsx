'use client';
import React, { useState } from 'react';
import { 
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  InputAdornment,
  useTheme
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import CheckIcon from '@mui/icons-material/Check';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GetBalance from '../components/GetBalance';
import { useUser } from '../contexts/UserContext'; // Import the useUser context hook

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { userData, setUserData, toggleDeveloperMode } = useUser(); // Use the user context
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const handleCopy = (text: string, type: 'userId' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'userId') {
      setCopiedUserId(true);
      setTimeout(() => setCopiedUserId(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const toggleAddressVisibility = () => {
    setShowAddress(!showAddress);
  };

  const userId = userData?.userId || '';
  const address = userData?.address || '';

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Your Profile
        </Typography>

        <Card sx={{ 
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.secondary.main}33`,
          borderRadius: '16px',
          boxShadow: `0 0 15px ${theme.palette.secondary.main}33`,
          mb: 4
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
                  Wallet Information
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Manage your account details
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: `${theme.palette.secondary.main}33`, mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="User ID"
                  value={userId}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={copiedUserId ? 'Copied!' : 'Copy to clipboard'}>
                          <IconButton onClick={() => handleCopy(userId, 'userId')} sx={{ color: theme.palette.secondary.main }}>
                            {copiedUserId ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    sx: {
                      color: theme.palette.text.primary,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: `${theme.palette.secondary.main}33` }
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root': { color: `${theme.palette.secondary.main}aa` },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.secondary.main }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Wallet Address"
                  value={showAddress ? address : '••••••••••••••••••••••••••••••••'}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleAddressVisibility} sx={{ color: theme.palette.secondary.main }}>
                          {showAddress ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        {showAddress && (
                          <Tooltip title={copiedAddress ? 'Copied!' : 'Copy to clipboard'}>
                            <IconButton onClick={() => handleCopy(address, 'address')} sx={{ color: theme.palette.secondary.main }}>
                              {copiedAddress ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </InputAdornment>
                    ),
                    sx: {
                      color: theme.palette.text.primary,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: `${theme.palette.secondary.main}33` }
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root': { color: `${theme.palette.secondary.main}aa` },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.secondary.main }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <GetBalance holderAddress={address} compact />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.secondary.main}33`,
          borderRadius: '16px',
          boxShadow: `0 0 15px ${theme.palette.secondary.main}33`,
          mb: 4
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DeveloperModeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                  Developer Settings
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Access advanced features
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: `${theme.palette.secondary.main}33`, mb: 3 }} />

            <FormControlLabel
              control={
                <Switch
                    checked={userData.developerMode}
                    onChange={toggleDeveloperMode}
                    color="secondary"
                />
              }
              label={<Typography sx={{ color: theme.palette.text.primary }}>Enable Developer Mode</Typography>}
              sx={{ ml: 0 }}
            />

            {userData.developerMode && (
              <Alert severity="warning" sx={{ 
                mt: 2, 
                bgcolor: `${theme.palette.secondary.main}10`,
                border: `1px solid ${theme.palette.secondary.main}33`,
                color: theme.palette.text.primary
              }}>
                Warning: Developer mode enables access to experimental features that may be unstable.
              </Alert>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => setUserData({ userId: '', address: '', developerMode: false })} // Clears user data on logout
            color="error"
            sx={{
              borderRadius: '20px',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
            }}
          >
            Log Out
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
