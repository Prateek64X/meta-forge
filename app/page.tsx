'use client';
import React, { useState, useEffect } from 'react';
import Carousel from './components/Carousel';
import GamesGrid from './components/GamesGrid';
import { Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProfilePage from './profile/page';
import { useUser } from './contexts/UserContext';

// Dynamically import GameLauncher with SSR disabled
const GameLauncher = dynamic(
  () => import('./components/GameLauncher'),
  { ssr: false }
);

const featuredGames = [
  {
    id: 1,
    title: "Rooftop Run",
    description: "Race across the rooftops of San Fransisco skylines!",
    image: "rooftop_run.png",
    entryCost: 1,
    playersOnline: 0,
    meta_link: 'https://horizon.meta.com/world/618250098043926/?locale=en_US',
  },
  {
    id: 2,
    title: "Zombie Wars",
    description: "Dare to survive the zombie night.",
    image: "zombie_wars.png",
    entryCost: 1,
    playersOnline: 0,
    meta_link: 'https://horizon.meta.com/worlds/631234523404686/?snapshot_id=1594378804596639',
  },
];

// Slot machine game without gameConfig
const slotMachineGame = {
  id: 3,
  title: "Slot Machine",
  description: "Try your luck with our exciting slot machine game!",
  image: "slot_machine.png",
  entryCost: 2,
  playersOnline: 0,
};

const allGames = [...featuredGames, slotMachineGame];

export default function Home() {
  const { userData, setUserData } = useUser(); // Use context
  const [showProfile, setShowProfile] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState(null);

  const router = useRouter();

  const handleHolderCreated = (address: string, userId: string) => {
    setUserData({ address, userId });
  };

  const handleLogout = () => {
    setShowProfile(false);
    setUserData({ userId: '', address: '' });
  };

  const launchGame = async (gameConfig: any, gameId: number, meta_link?: string) => {
    // For games 1 and 2, we'll have meta_link
    if (meta_link) {
      router.push(meta_link);
      return;
    }
  
    // For game 3, we'll have gameConfig
    const config = await gameConfig();
    setCurrentGameConfig(config);
    setShowGame(true);
  };

  // Ensure userData is not null or undefined before checking its values
  const isLoggedIn = userData?.userId && userData?.address;

  return (
    <main style={{
      backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      minHeight: '100vh',
      color: 'white',
    }}>
      {showProfile && isLoggedIn ? (
        <ProfilePage 
          userId={userData?.userId} // Optional chaining to prevent error if userData is null
          address={userData?.address} // Optional chaining to prevent error if userData is null
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
          <Carousel games={featuredGames} onGameSelect={(config, id) => launchGame(config, id, featuredGames.find(g => g.id === id)?.meta_link)} />
          </Box>
          
          <GamesGrid games={allGames} onGameSelect={(config, id) => launchGame(config, id, allGames.find(g => g.id === id)?.meta_link)} />
        </Container>
      )}
    </main>
  );
}
