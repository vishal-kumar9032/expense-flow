import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
  Fade,
  Zoom,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@techcorp.com', password: 'admin123', color: '#ef4444' },
    { role: 'Manager', email: 'sarah@techcorp.com', password: 'manager123', color: '#3b82f6' },
    { role: 'Employee', email: 'john@techcorp.com', password: 'employee123', color: '#10b981' },
  ];

  const fillDemo = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'moveBackground 20s linear infinite',
        },
        '@keyframes moveBackground': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={800}>
              <Box sx={{ color: '#fff', pr: { md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 8px 16px rgba(0,168,107,0.4)',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h3" fontWeight={800}>
                    ExpenseHub
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                  Manage expenses with ease
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, fontSize: '1.1rem' }}>
                  Track, submit, and approve expenses in real-time. Streamline your workflow with our powerful expense management system.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {['Multi-level Approvals', 'OCR Scanning', 'Real-time Analytics', 'Role-based Access'].map((feature, index) => (
                    <Zoom in timeout={1000 + index * 200} key={feature}>
                      <Chip
                        label={feature}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: '#fff',
                          fontWeight: 600,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                      />
                    </Zoom>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  backdropFilter: 'blur(20px)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sign in to continue to your dashboard
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Link
                      component="button"
                      variant="body2"
                      type="button"
                      sx={{
                        textDecoration: 'none',
                        color: '#00A86B',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
                      boxShadow: '0 8px 16px rgba(0,168,107,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #00824F 0%, #006B3F 100%)',
                        boxShadow: '0 12px 20px rgba(0,168,107,0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Or continue with
                    </Typography>
                  </Divider>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {[
                      { icon: <GoogleIcon />, label: 'Google', color: '#DB4437' },
                      { icon: <GitHubIcon />, label: 'GitHub', color: '#333' },
                      { icon: <LinkedInIcon />, label: 'LinkedIn', color: '#0A66C2' },
                    ].map((provider) => (
                      <Button
                        key={provider.label}
                        fullWidth
                        variant="outlined"
                        startIcon={provider.icon}
                        sx={{
                          py: 1.2,
                          borderColor: 'divider',
                          color: 'text.primary',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: provider.color,
                            color: provider.color,
                            bgcolor: `${provider.color}10`,
                          },
                        }}
                      >
                        {provider.label}
                      </Button>
                    ))}
                  </Box>

                  <Typography variant="body2" align="center" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/register"
                      sx={{
                        color: '#00A86B',
                        fontWeight: 700,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Fade>

            {/* Demo Accounts */}
            <Fade in timeout={1200}>
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mb: 2, color: '#fff', fontWeight: 600 }}
                >
                  🚀 Quick Demo Access
                </Typography>
                <Grid container spacing={2}>
                  {demoAccounts.map((account, index) => (
                    <Grid item xs={12} sm={4} key={account.role}>
                      <Zoom in timeout={1400 + index * 200}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              transform: 'translateY(-8px) scale(1.05)',
                              boxShadow: `0 12px 24px ${account.color}40`,
                            },
                          }}
                          onClick={() => fillDemo(account.email, account.password)}
                        >
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Chip
                              label={account.role}
                              size="small"
                              sx={{
                                mb: 1,
                                fontWeight: 700,
                                bgcolor: account.color,
                                color: '#fff',
                              }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                              Click to autofill
                            </Typography>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
