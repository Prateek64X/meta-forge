// Navbar.tsx
'use client';
import React, { useEffect, useState } from 'react';
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
import { useUser } from '../contexts/UserContext'; // Import the useUser hook

interface NavbarProps {
  onHolderCreated?: (address: string, userId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHolderCreated = () => {} }) => {
  const theme = useTheme();
  const router = useRouter();
  const { userData } = useUser(); // Get user data from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!userData.userId); // Check if user is logged in based on userData
  }, [userData]);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push('/profile');  // Navigate to the profile page if logged in
    } else {
      router.push('/login');  // Otherwise, navigate to the login page
    }
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HolderWallet onHolderCreated={onHolderCreated} />
          
          <IconButton
            onClick={handleProfileClick}  // Navigate to the profile or login page
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
