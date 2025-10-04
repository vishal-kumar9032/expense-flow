import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A86B', // Green
      light: '#33BA86',
      dark: '#00824F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#000000', // Black
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#f5f7fa',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    success: {
      main: '#00A86B',
      light: '#33BA86',
      dark: '#00824F',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.08)',
    '0 6px 12px rgba(0,0,0,0.1)',
    '0 8px 16px rgba(0,0,0,0.12)',
    '0 12px 24px rgba(0,0,0,0.14)',
    '0 16px 32px rgba(0,0,0,0.16)',
    '0 20px 40px rgba(0,0,0,0.18)',
    '0 24px 48px rgba(0,0,0,0.2)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00824F 0%, #006B3F 100%)',
            boxShadow: '0 6px 20px rgba(0, 168, 107, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(0, 168, 107, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#00A86B',
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#f9fafb',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

export default theme;
