// components/ThemeRegistry.tsx
'use client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { 
      main: '#bcc0c8', // light blue-gray for text and components
      light: '#e1e3e8', // lighter variant
      dark: '#8a8e94'  // darker variant
    },
    secondary: { 
      main: '#ffd700', // gold for highlights
      light: '#ffeb3b', // lighter gold
      dark: '#ffab00'  // darker gold
    },
    background: {
      default: '#0f172a', // dark blue background
      paper: '#1e293b'    // slightly lighter for cards
    },
    text: {
      primary: '#e1e3e8', // near-white for text
      secondary: '#bcc0c8' // light blue-gray for secondary text
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
})

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}