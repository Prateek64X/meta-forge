'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  entryCost: number;
  playersOnline: number;
  gameConfig?: () => Promise<any>;
  meta_link?: string;
}

interface GridProps {
  games: Game[];
  onGameSelect?: (gameConfig: () => Promise<any>, gameId: number, meta_link?: string) => void;
}

const GamesGrid: React.FC<GridProps> = ({ games, onGameSelect }) => {
  const router = useRouter();
  const { userData } = useUser();
  const { address } = userData;
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const handlePlayClick = (game: Game) => {
    if (!address) {
      setSnackbarMessage('Please connect your wallet first');
      setOpenSnackbar(true);
      return;
    }
    
    // If game has meta_link, go directly to meta game
    if (game.meta_link) {
      router.push(`/metagame?meta_link=${encodeURIComponent(game.meta_link)}`);
      return;
    }
    
    // For non-meta games, proceed directly without withdrawal
    if (game.gameConfig && onGameSelect) {
      onGameSelect(game.gameConfig, game.id);
      return;
    }
    
    // Old withdrawal logic (commented out)
    // setSelectedGame(game);
    // setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGame(null);
    setError(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  /*
  // Commented out withdrawal logic
  const handleConfirmWithdraw = async () => {
    if (!selectedGame || !userId) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
      const apiKey = process.env.NEXT_PUBLIC_METAL_API_KEY;
  
      const response = await fetch(
        `https://api.metal.build/holder/${userId}/withdraw`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey || '',
          },
          body: JSON.stringify({
            tokenAddress: tokenAddress,
            amount: selectedGame.entryCost,
            toAddress: address,
          }),
        }
      );
  
      const withdraw = await response.json();
  
      if (response.ok) {
        setSnackbarMessage(`Successfully withdrew ${selectedGame.entryCost} tokens`);
        setOpenSnackbar(true);
  
        if (selectedGame.gameConfig && onGameSelect) {
          onGameSelect(selectedGame.gameConfig, selectedGame.id);
        }
      } else {
        const errorMsg = withdraw.message || 'Withdrawal failed';
        setError(errorMsg);
        setSnackbarMessage(errorMsg);
        setOpenSnackbar(true);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMsg);
      setSnackbarMessage(errorMsg);
      setOpenSnackbar(true);
    } finally {
      setIsProcessing(false);
      handleCloseDialog();
    }
  };
  */

  return (
    <Box sx={{ margin: '0 auto', py: 2 }}>
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
                onClick={() => handlePlayClick(game)}
                sx={{
                  background: 'linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)',
                  color: '#202d46',
                  fontWeight: 'bold',
                  borderRadius: '0 0 12px 12px',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ffeb3b 30%, #ffd700 90%)'
                  }
                }}
              >
                Play Now
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 
      Commented out withdrawal dialog since we're not using it currently
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
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
          Confirm Token Withdrawal
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.8)', mt: 2 }}>
            You are about to withdraw {selectedGame?.entryCost} tokens to play {selectedGame?.title}.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
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
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmWithdraw} 
            disabled={isProcessing}
            sx={{
              background: 'linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)',
              color: '#202d46',
              fontWeight: 'bold',
              borderRadius: '12px',
              '&:disabled': {
                background: 'rgba(255,215,0,0.5)',
                color: 'rgba(32,45,70,0.5)'
              }
            }}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={20} sx={{ color: '#202d46', mr: 1 }} />
                Processing...
              </>
            ) : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      */}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'}
          sx={{ 
            background: 'linear-gradient(135deg, rgba(32,45,70,0.95) 0%, #202d46 100%)',
            color: '#ffd700',
            border: '1px solid rgba(255,215,0,0.3)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GamesGrid;