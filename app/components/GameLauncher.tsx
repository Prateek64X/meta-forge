'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, CircularProgress, Typography, keyframes } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import dynamic from 'next/dynamic';

interface GameLauncherProps {
  gameConfig: Phaser.Types.Core.GameConfig;
  onClose: () => void;
}

const coinAnimation = keyframes`
  0% { transform: scale(1); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const GameLauncher = ({ gameConfig, onClose }: GameLauncherProps) => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(100);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [Phaser, setPhaser] = useState<typeof import('phaser') | null>(null);

  // Dynamically import Phaser on client side
  useEffect(() => {
    import('phaser').then(phaser => {
      setPhaser(phaser);
    });
  }, []);

  // Expose coin management to the game
  useEffect(() => {
    (window as any).updateCoins = (amount: number) => {
      if (amount > 0) {
        setWinAmount(amount);
        setShowWinAnimation(true);
        setTimeout(() => setShowWinAnimation(false), 2000);
      }
      setCoins(prev => prev + amount);
    };

    return () => {
      delete (window as any).updateCoins;
    };
  }, []);

  // Initialize game after Phaser is loaded
  useEffect(() => {
    if (!Phaser || !gameContainer.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...gameConfig,
      parent: gameContainer.current
    };

    gameInstance.current = new Phaser.Game(config);

    gameInstance.current.events.once('ready', () => {
      setLoading(false);
    });

    return () => {
      gameInstance.current?.destroy(true);
      gameInstance.current = null;
    };
  }, [Phaser, gameConfig]);

  if (!Phaser) {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress size={80} sx={{ color: '#ffd700' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10001
        }}>
          <CircularProgress size={80} sx={{ color: '#ffd700' }} />
        </Box>
      )}

      {/* Game HUD */}
      <Box sx={{
        position: 'fixed',
        top: 16,
        left: 16,
        right: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10000,
        pointerEvents: 'none'
      }}>
        {/* Back Button */}
        <IconButton
          onClick={onClose}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            pointerEvents: 'auto',
            '&:hover': {
              backgroundColor: 'rgba(255,215,0,0.5)'
            }
          }}
        >
          <ArrowBack fontSize="large" />
        </IconButton>

        {/* Coin Display */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: '20px',
          padding: '8px 16px',
          position: 'relative'
        }}>
          <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
            {coins} Coins
          </Typography>

          {/* Win Animation */}
          {showWinAnimation && winAmount && (
            <Typography 
              variant="h6"
              sx={{
                position: 'absolute',
                right: 16,
                color: winAmount > 0 ? '#4caf50' : '#f44336',
                fontWeight: 'bold',
                animation: `${coinAnimation} 2s ease-out`,
              }}
            >
              {winAmount > 0 ? '+' : ''}{winAmount}
            </Typography>
          )}
        </Box>
      </Box>

      <div ref={gameContainer} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default GameLauncher;