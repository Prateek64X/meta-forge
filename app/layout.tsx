// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './components/ThemeRegistry';
import { DeveloperModeProvider } from './contexts/DeveloperModeContext';
import { UserProvider } from './contexts/UserContext'; // ⬅️ import it
import Navbar from './components/Navbar';

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
          <UserProvider> {/* ⬅️ wrap everything with UserProvider */}
            <ThemeRegistry>
              <Navbar />
              {children}
            </ThemeRegistry>
          </UserProvider>
        </DeveloperModeProvider>
      </body>
    </html>
  );
}
