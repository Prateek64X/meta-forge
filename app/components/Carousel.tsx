'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  entryCost: number;
  playersOnline: number;
}

interface CarouselProps {
  games: Game[];
}

const Carousel: React.FC<CarouselProps> = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, games.length]);

  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      height: '60vh',
      minHeight: '400px',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      {/* Carousel slides */}
      {games.map((game, index) => (
        <Box
          key={game.id}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transition: 'opacity 1s ease-in-out',
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <CardMedia
            component="img"
            image={`/game_cover/${game.image}`}
            alt={game.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Game info overlay */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
            padding: '2rem',
            color: 'white',
            zIndex: 2
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {game.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, maxWidth: '60%' }}>
              {game.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MonetizationOn sx={{ color: '#ffd700', mr: 1, fontSize: '2rem' }} />
                <Typography variant="h6" sx={{ color: '#ffd700' }}>
                  {game.entryCost} Tokens
                </Typography>
              </Box>
              <Typography variant="h6">
                {game.playersOnline} players online
              </Typography>
              <Button
                variant="contained"
                sx={{
                  ml: 'auto',
                  background: 'linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)',
                  color: '#202d46',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ffeb3b 30%, #ffd700 90%)'
                  }
                }}
              >
                Play Now
              </Button>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Navigation arrows */}
      <IconButton
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.8)',
          }
        }}
      >
        <ChevronLeft fontSize="large" />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.8)',
          }
        }}
      >
        <ChevronRight fontSize="large" />
      </IconButton>

      {/* Indicators */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1,
        zIndex: 3
      }}>
        {games.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? '#ffd700' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: index === currentIndex ? '#ffd700' : 'rgba(255,255,255,0.8)',
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;