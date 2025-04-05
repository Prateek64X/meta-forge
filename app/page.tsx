// Updated page.tsx
'use client';
import React, { useState } from 'react';
import Carousel from './components/Carousel';
import GamesGrid from './components/GamesGrid';
import { Container, Typography, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import ProfilePage from './profile/page';

// Dynamically import GameLauncher with SSR disabled
const GameLauncher = dynamic(
  () => import('./components/GameLauncher'),
  { ssr: false }
);

// Dynamically import the slot machine config with SSR disabled
const slotMachineConfig = dynamic(
  () => import('@/app/games/slotMachineConfig').then(mod => mod.default),
  { ssr: false }
);

const featuredGames = [
  {
    id: 1,
    title: "Slot Machine",
    description: "Try your luck with our exciting slot machine game!",
    image: "1.png",
    entryCost: 10,
    playersOnline: 542,
    gameConfig: slotMachineConfig
  },
];

const allGames = [...featuredGames];

export default function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    userId: '',
    address: ''
  });
  const [showGame, setShowGame] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState(null);

  const handleHolderCreated = (address: string, userId: string) => {
    setUserData({ address, userId });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setShowProfile(false);
    setIsLoggedIn(false);
    setUserData({ userId: '', address: '' });
  };

  const launchGame = async (gameConfig: any) => {
    const config = await gameConfig;
    setCurrentGameConfig(config);
    setShowGame(true);
  };

  return (
    <main style={{
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      minHeight: '100vh',
      color: 'white',
    }}>
      {showProfile && isLoggedIn ? (
        <ProfilePage 
          userId={userData.userId}
          address={userData.address}
          onLogout={handleLogout}
        />
      ) : showGame ? (
        <GameLauncher 
          gameConfig={currentGameConfig} 
          onClose={() => setShowGame(false)} 
        />
      ) : (
        <Container maxWidth="xl" sx={{ pt: 2 }}>
          <Typography variant="h5" sx={{ 
            mb: 2,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ffd700 30%, #ffeb3b 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'left'
          }}>
            Featured Games
          </Typography>
          
          <Box sx={{ mb: 8 }}>
            <Carousel games={featuredGames} onGameSelect={launchGame} />
          </Box>
          
          <GamesGrid games={allGames} onGameSelect={launchGame} />
        </Container>
      )}
    </main>
  );
}
