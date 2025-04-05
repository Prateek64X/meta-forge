'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Fade } from '@mui/material';
import RedeemButton from '../components/RedeemButton';
import { useUser } from '../contexts/UserContext';
import { useSearchParams } from 'next/navigation';

const PLAY_SESSION_KEY = 'meta_game_session_start';

const MetaGamePage = () => {
  const searchParams = useSearchParams();
  const metaLink = searchParams.get('meta_link');
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const sessionStart = localStorage.getItem(PLAY_SESSION_KEY);

    if (sessionStart) {
      const timer = setTimeout(() => {
        const start = new Date(sessionStart).getTime();
        const now = new Date().getTime();
        const durationMs = now - start;
        const durationHours = durationMs / (1000 * 60 * 60);

        let tokensEarned = Math.floor(durationHours * 600);
        
        if (tokensEarned > 0) {
          setEarnedTokens(tokensEarned);
          setAmount(tokensEarned);
          setSessionEnded(true);
        }

        localStorage.removeItem(PLAY_SESSION_KEY);
        setLoading(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLaunchGame = () => {
    if (!metaLink) {
      console.error('No meta_link provided');
      return;
    }

    const gameWindow = window.open(metaLink, '_blank');
    localStorage.setItem(PLAY_SESSION_KEY, new Date().toISOString());

    if (!gameWindow || gameWindow.closed || typeof gameWindow.closed === 'undefined') {
      alert('Please allow pop-ups to launch the game.');
      return;
    }

    const pollInterval = setInterval(() => {
      if (gameWindow.closed) {
        clearInterval(pollInterval);
        window.location.reload();
      }
    }, 1000);
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'black'
      }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!userData?.address) {
    return (
      <Box sx={{
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <Typography variant="h5">Please connect your wallet to access the game.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      backgroundColor: 'black',
      color: 'white',
      minHeight: '100vh',
      padding: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Typography variant="h4" gutterBottom>Meta Horizon Play Session</Typography>

      {!sessionEnded ? (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLaunchGame}
          sx={{ mt: 2 }}
        >
          Launch Game World
        </Button>
      ) : (
        <Fade in={sessionEnded}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="success.main">
              🎉 Session Ended! You earned {earnedTokens} tokens.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <RedeemButton
                amount={amount}
                sendTo={userData.address}
              />
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default MetaGamePage;