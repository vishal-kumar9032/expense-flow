import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PendingActions,
  CheckCircle,
  Cancel,
  AttachMoney,
  Receipt,
  Timeline,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { expenseAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await expenseAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>;
  }

  const statCards = [
    {
      title: 'Total Expenses',
      value: stats?.totalExpenses || 0,
      icon: <Receipt sx={{ fontSize: 40 }} />,
      color: '#00A86B',
      gradient: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Pending Review',
      value: stats?.pendingExpenses || 0,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Approved',
      value: stats?.approvedExpenses || 0,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Rejected',
      value: stats?.rejectedExpenses || 0,
      icon: <Cancel sx={{ fontSize: 40 }} />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      trend: '-3%',
      trendUp: false,
    },
  ];

  const amountCards = [
    {
      title: 'Total Approved',
      value: `$${stats?.totalAmount?.toFixed(2) || '0.00'}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#00A86B',
      gradient: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
      percentage: 75,
    },
    {
      title: 'Pending Amount',
      value: `$${stats?.pendingAmount?.toFixed(2) || '0.00'}`,
      icon: <Timeline sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      percentage: 45,
    },
  ];

  // Chart data
  const pieData = [
    { name: 'Approved', value: stats?.approvedExpenses || 0, color: '#10b981' },
    { name: 'Pending', value: stats?.pendingExpenses || 0, color: '#f59e0b' },
    { name: 'Rejected', value: stats?.rejectedExpenses || 0, color: '#ef4444' },
  ];

  const barData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 3908 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 3800 },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            mb: 1,
            background: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your expenses today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: card.gradient,
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: `0 8px 16px ${card.color}40`,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Chip
                    icon={card.trendUp ? <ArrowUpward sx={{ fontSize: 16 }} /> : <ArrowDownward sx={{ fontSize: 16 }} />}
                    label={card.trend}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: card.trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: card.trendUp ? '#10b981' : '#ef4444',
                      border: 'none',
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Typography variant="h3" fontWeight={800} sx={{ color: card.color }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Amount Cards with Progress */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {amountCards.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                background: card.gradient,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 12px 24px ${card.color}60`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={800}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>Progress</Typography>
                    <Typography variant="caption" fontWeight={700}>{card.percentage}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={card.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#fff',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: 400,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            <CardContent sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Monthly Expenses
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00A86B" />
                      <stop offset="100%" stopColor="#00824F" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: 400,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
              },
            }}
          >
            <CardContent sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Status Distribution
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: 8, 
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
