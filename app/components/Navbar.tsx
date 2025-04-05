// Navbar.tsx
'use client';
import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Badge,
  useTheme
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HolderWallet from './HolderWallet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onHolderCreated?: (address: string, userId: string) => void;
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onHolderCreated = () => {}, 
  isLoggedIn = false
}) => {
  const theme = useTheme();
  const router = useRouter();

  // Navigate to the profile page when the profile button is clicked
  const handleProfileClick = () => {
    router.push('/profile');  // This will navigate to the Profile page
  };

  return (
    <AppBar 
      position="static"
      sx={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(40,40,40,0.9) 50%, rgba(0,0,0,0) 100%)',
        backdropFilter: 'blur(8px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Title with Link component */}
        <Link href="/" passHref>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 0 8px rgba(255,215,0,0.3)`,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            Meta Forge
          </Typography>
        </Link>

        {/* Right side container */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Holder Wallet Component */}
          <HolderWallet onHolderCreated={onHolderCreated} />
          
          {/* Profile Button - always shown, navigates to the profile page */}
          <IconButton
            onClick={handleProfileClick}  // Always navigate to Profile page
            sx={{
              color: `${theme.palette.secondary.main}`,
              '&:hover': {
                backgroundColor: `${theme.palette.secondary.main}33`,
              },
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#44b700',
                  color: '#44b700',
                  boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.8)',
                }
              }}
            >
              <AccountCircle sx={{ fontSize: 32 }} />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
