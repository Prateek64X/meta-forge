// layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './components/ThemeRegistry';
import { DeveloperModeProvider } from './contexts/DeveloperModeContext';
import Navbar from './components/Navbar'; // Import Navbar here

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meta Forge',
  description: 'Roblox-like game platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DeveloperModeProvider>
          <ThemeRegistry>
            {/* Add Navbar here */}
            <Navbar />
            {children}
          </ThemeRegistry>
        </DeveloperModeProvider>
      </body>
    </html>
  );
}
