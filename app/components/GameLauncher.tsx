'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, CircularProgress, Typography, keyframes } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';

interface GameLauncherProps {
  onClose: () => void;
}

// Define the keyframes outside the component
const coinAnimation = keyframes`
  0% { transform: scale(1); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const GameLauncher = ({ onClose }: GameLauncherProps) => {
  const gameContainer = useRef<HTMLDivElement>(null);
  const gameInstance = useRef<Phaser.Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(100);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [Phaser, setPhaser] = useState<typeof import('phaser') | null>(null);

  // Slot Machine Configuration
  const slotMachineConfig = {
    type: Phaser?.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: {
      preload: function(this: Phaser.Scene) {
        // Load your assets here
        this.load.image('background', '/games/slots/background.png');
        this.load.image('reel', '/games/slots/reel.png');
        this.load.image('symbol1', '/games/slots/symbol1.png');
        this.load.image('symbol2', '/games/slots/symbol2.png');
        this.load.image('symbol3', '/games/slots/symbol3.png');
        this.load.image('lever', '/games/slots/lever.png');
      },
      create: function(this: Phaser.Scene) {
        // Create game objects here
        const background = this.add.image(400, 300, 'background');
        const reel1 = this.add.image(300, 300, 'reel');
        const reel2 = this.add.image(400, 300, 'reel');
        const reel3 = this.add.image(500, 300, 'reel');
        const lever = this.add.image(650, 300, 'lever').setInteractive();

        lever.on('pointerdown', () => {
          if (typeof (window as any).updateCoins === 'function') {
            // Random win between -2 and 10 coins
            const win = Math.floor(Math.random() * 13) - 2;
            (window as any).updateCoins(win);
          }
        });
      },
      update: function() {
        // Game loop
      }
    }
  };

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
      ...slotMachineConfig,
      parent: gameContainer.current,
      type: Phaser.AUTO
    };

    gameInstance.current = new Phaser.Game(config);

    gameInstance.current.events.once('ready', () => {
      setLoading(false);
    });

    return () => {
      gameInstance.current?.destroy(true);
      gameInstance.current = null;
    };
  }, [Phaser]);

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
          {showWinAnimation && winAmount !== null && (
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