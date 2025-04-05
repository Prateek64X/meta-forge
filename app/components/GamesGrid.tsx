'use client';
import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import dynamic from 'next/dynamic';

// Dynamically import GameLauncher with SSR disabled
const GameLauncher = dynamic(
  () => import('./GameLauncher'),
  { ssr: false }
);

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  entryCost: number;
  playersOnline: number;
  gameConfig: () => Promise<any>; // Now expects a function that returns a promise
}

interface GridProps {
  games: Game[];
}

const GamesGrid: React.FC<GridProps> = ({ games }) => {
  const [currentGame, setCurrentGame] = useState<(() => Promise<any>) | null>(null);
  const [gameConfig, setGameConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePlayClick = async (configLoader: () => Promise<any>) => {
    setLoading(true);
    try {
      const config = await configLoader();
      setGameConfig(config);
      setCurrentGame(() => configLoader); // Store the loader function for reference
    } catch (error) {
      console.error('Failed to load game config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      margin: '0 auto', 
      py: 2,
    }}>
      <Typography variant="h5" sx={{ 
        mb: 4,
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'left'
      }}>
        All Games
      </Typography>
      
      <Grid container spacing={4}>
        {games.map((game) => (
          <Grid item key={game.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, rgba(32,45,70,0.9) 0%, #202d46 100%)',
              borderRadius: '12px',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 16px rgba(255,215,0,0.2)',
              }
            }}>
              <CardMedia
                component="img"
                image={`/game_cover/${game.image}`}
                alt={game.title}
                sx={{ 
                  width: '100%',
                  height: '240px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ 
                  color: '#ffd700',
                  fontWeight: 'bold'
                }}>
                  {game.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  mb: 2,
                  minHeight: '40px'
                }}>
                  {game.description}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOn sx={{ color: '#ffd700', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#ffd700' }}>
                      {game.entryCost} Tokens
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {game.playersOnline} players
                  </Typography>
                </Box>
              </CardContent>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handlePlayClick(game.gameConfig)}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)',
                  color: '#202d46',
                  fontWeight: 'bold',
                  borderRadius: '0 0 12px 12px',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ffeb3b 30%, #ffd700 90%)'
                  },
                  '&:disabled': {
                    background: 'rgba(255, 215, 0, 0.5)'
                  }
                }}
              >
                {loading ? 'Loading...' : 'Play Now'}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Game Launcher */}
      {gameConfig && (
        <GameLauncher 
          gameConfig={gameConfig}
          onClose={() => {
            setGameConfig(null);
            setCurrentGame(null);
          }}
        />
      )}
    </Box>
  );
};

export default GamesGrid;