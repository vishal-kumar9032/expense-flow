import React from 'react';
import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

// Skeleton for stat cards
export const StatCardSkeleton = () => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rectangular" width={60} height={28} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={40} />
    </CardContent>
  </Card>
);

// Skeleton for table rows
export const TableRowSkeleton = ({ columns = 5 }) => (
  <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'center' }}>
    {Array.from({ length: columns }).map((_, index) => (
      <Skeleton key={index} variant="text" height={30} sx={{ flex: 1 }} />
    ))}
  </Box>
);

// Skeleton for entire table
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} columns={columns} />
      ))}
    </CardContent>
  </Card>
);

// Skeleton for dashboard
export const DashboardSkeleton = () => (
  <Box>
    <Skeleton variant="text" width={300} height={50} sx={{ mb: 3 }} />
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCardSkeleton />
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={320} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Empty state component
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  actionText = 'Get Started' 
}) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 3,
    }}
  >
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(0,168,107,0.1) 0%, rgba(0,130,79,0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        '& .MuiSvgIcon-root': {
          fontSize: 60,
          color: '#00A86B',
          opacity: 0.6,
        },
      }}
    >
      {icon}
    </Box>
    <Box sx={{ mb: 3 }}>
      <Box
        component="span"
        sx={{
          fontSize: '4rem',
          display: 'block',
          mb: 2,
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontSize: '1.1rem',
          color: 'text.secondary',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        {description}
      </Box>
    </Box>
    {action && (
      <Box
        onClick={action}
        sx={{
          display: 'inline-flex',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,168,107,0.3)',
          },
        }}
      >
        {actionText}
      </Box>
    )}
  </Box>
);

// Loading overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}
  >
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '4px solid rgba(0,168,107,0.2)',
          borderTopColor: '#00A86B',
          animation: 'spin 1s linear infinite',
          mx: 'auto',
          mb: 2,
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
      <Box sx={{ fontSize: '1.2rem', fontWeight: 600, color: 'text.primary' }}>
        {message}
      </Box>
    </Box>
  </Box>
);

// Animated badge
export const AnimatedBadge = ({ children, count, color = 'error' }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    {children}
    {count > 0 && (
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          minWidth: 20,
          height: 20,
          borderRadius: '10px',
          bgcolor: color === 'error' ? '#ef4444' : '#00A86B',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.8, transform: 'scale(1.1)' },
          },
        }}
      >
        {count > 99 ? '99+' : count}
      </Box>
    )}
  </Box>
);

// Progress card
export const ProgressCard = ({ title, current, total, color = '#00A86B' }) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 16px ${color}40`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
              {title}
            </Box>
            <Box sx={{ fontSize: '0.875rem', fontWeight: 700, color }}>
              {percentage}%
            </Box>
          </Box>
          <Box
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: `${color}20`,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${percentage}%`,
                bgcolor: color,
                borderRadius: 4,
                transition: 'width 0.5s ease',
              }}
            />
          </Box>
        </Box>
        <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color }}>
          {current} / {total}
        </Box>
      </CardContent>
    </Card>
  );
};

export default {
  StatCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  EmptyState,
  LoadingOverlay,
  AnimatedBadge,
  ProgressCard,
};
