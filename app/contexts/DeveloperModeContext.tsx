'use client';
import React, { createContext, useContext, useState } from 'react';

interface DevModeContextType {
  developerMode: boolean;
  setDeveloperMode: (value: boolean) => void;
}

const DeveloperModeContext = createContext<DevModeContextType | undefined>(undefined);

export const useDeveloperMode = () => {
  const context = useContext(DeveloperModeContext);
  if (!context) throw new Error('useDeveloperMode must be used within a DeveloperModeProvider');
  return context;
};

export const DeveloperModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [developerMode, setDeveloperMode] = useState(false);

  return (
    <DeveloperModeContext.Provider value={{ developerMode, setDeveloperMode }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};
