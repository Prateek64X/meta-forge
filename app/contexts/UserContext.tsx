// UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  userId: string;
  address: string;
  developerMode: boolean;
}

interface UserContextProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  toggleDeveloperMode: () => void;
  logout: () => void;
}

const LOCAL_STORAGE_KEY = 'metagame_user_data';

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    userId: '',
    address: '',
    developerMode: false,
  });

  // 🔄 Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.userId && parsed?.address) {
          setUserData(parsed);
        }
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
      }
    }
  }, []);

  // 💾 Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const toggleDeveloperMode = () => {
    setUserData((prev) => ({ ...prev, developerMode: !prev.developerMode }));
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUserData({ userId: '', address: '', developerMode: false });
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, toggleDeveloperMode, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
